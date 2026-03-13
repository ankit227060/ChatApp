import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthProvider"
import axios from "axios"
import { Chat, Game, Media, Message } from "../types"
import { socket, pollingManager } from "../socket"

type ContextContent = {
  chats: Chat[]
  createMessage: (data: { content: string }) => Promise<void>
  createGame: (chatId: string) => Promise<void>
  loading: boolean
  findChat: (userId: string) => Chat | undefined
  createChat: (members: string[]) => Promise<Chat> | undefined
  updateChat: (chatId: string, updatedData: object) => void
  updateGameMessage: (chatId: string, gameId: string, message: string) => void
}

const ChatContext = createContext<ContextContent>({
  chats: [],
  createMessage: () => Promise.resolve(),
  createGame: () => Promise.resolve(),
  loading: true,
  findChat: () => undefined,
  createChat: () => undefined,
  updateChat: () => undefined,
  updateGameMessage: () => undefined,
})

interface ChatProviderProps {
  children: React.ReactNode
}

export default function ChatProvider({ children }: ChatProviderProps) {
  const { authUser } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  const playPop = () => {
    const pop = new Audio("/sounds/pop.mp3")
    pop.play()
  }

  const findChat = (userId: string) => {
    return chats.find((chat) => chat.type === "private" && chat.members.find((user) => user._id === userId))
  }

  const createChat = async (members: string[]) => {
    try {
      const res = await axios.post("/chat", { members })
      const chat = res.data
      setChats((chats) => [chat, ...chats])
      return chat
    } catch (err) {
      console.log(err)
    }
  }

  const createMessage = async (data: { content: string }) => {
    try {
      const res = await axios.post("/message", data)
      const msg = res.data
      addMessage(msg)
      return Promise.resolve()
    } catch (err) {
      console.log(err)
      return Promise.reject()
    }
  }

  const createGame = async (chatId: string) => {
    try {
      const res = await axios.post("/game", { chatId, from: authUser?._id })
      const msg = res.data
      addMessage(msg)
      return Promise.resolve()
    } catch (err) {
      console.log(err)
      return Promise.reject()
    }
  }

  const updateChat = (chatId: string, updatedData: object) => {
    setChats((chats) => chats.map((chat) => (chat._id === chatId ? { ...chat, ...updatedData } : chat)))
  }

  const addMessage = ({ message, images, links }: { message: Message; images: Media[]; links: Media[] }) => {
    const messages = document.getElementById("messages")
    const scrolledToBottom = messages && messages.scrollHeight - messages.scrollTop - messages.clientHeight < 1

    setChats((chats) =>
      chats.map((chat) => {
        if (chat._id === message.chat) {
          let unreadCount = chat?.unreadCount || 0
          if (!message.from || message.from?._id !== authUser?._id) {
            unreadCount++
          }
          const [messageImages, messageLinks] = [images, links]
          return {
            ...chat,
            messages: [...(chat?.messages || []), message],
            images: [...(chat?.images || []), ...(messageImages || [])],
            links: [...(chat?.links || []), ...(messageLinks || [])],
            unreadCount,
          }
        } else {
          return chat
        }
      })
    )

    if (scrolledToBottom) {
      setTimeout(() => {
        messages.scrollTo(0, messages.scrollHeight)
      }, 10)
    }
  }

  const updateGameMessage = (chatId: string, gameId: string, message: string) => {
    setChats((chats) =>
      chats.map((chat) =>
        chat._id === chatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.game && msg.game._id === gameId ? { ...msg, game: { ...msg.game, message } } : msg
              ),
            }
          : chat
      )
    )
  }

  const readMessages = async (chatId: string) => {
    if (authUser && chatId) {
      updateChat(chatId, { unreadCount: 0 })
      axios.post(`/chat/${chatId}/read`)
    }
  }

  useEffect(() => {
    function onConnect() {
      socket.emit("login", authUser?._id)
    }

    socket.on("connect", onConnect)

    return () => {
      socket.off("connect", onConnect)
    }
  }, [authUser])

  useEffect(() => {
    function onNewChat(chat: Chat) {
      setChats((chats) => [...chats, chat])
    }

    function onNewMessage(data: { message: Message; images: Media[]; links: Media[] }) {
      playPop()
      addMessage(data)
    }

    function onChatUpdate(chatId: string, updatedChat: object) {
      setChats((chats) => chats.map((chat) => (chat._id === chatId ? { ...chat, ...updatedChat } : chat)))
    }

    function onChatDelete(chatId: string) {
      setChats((chats) => chats.filter((chat) => chat._id !== chatId))
    }

    function onStartTyping({ userId, chatId }: { userId: string; chatId: string }) {
      setChats((chats) =>
        chats.map((chat) => {
          if (chat._id === chatId) {
            return { ...chat, typingUsers: Array.from(new Set([...chat.typingUsers, userId])) }
          } else {
            return chat
          }
        })
      )
    }

    function onStopTyping({ userId, chatId }: { userId: string; chatId: string }) {
      setChats((chats) =>
        chats.map((chat) => {
          if (chat._id === chatId) {
            return { ...chat, typingUsers: chat.typingUsers.filter((user) => user !== userId) }
          } else {
            return chat
          }
        })
      )
    }

    function onUserConnection(userId: string) {
      setChats((chats) =>
        chats.map((chat) => ({
          ...chat,
          members: chat.members.map((user) => (user._id === userId ? { ...user, isOnline: true } : user)),
        }))
      )
    }

    function onUserDisonnection(userId: string) {
      setChats((chats) =>
        chats.map((chat) => ({
          ...chat,
          members: chat.members.map((user) => (user._id === userId ? { ...user, isOnline: false } : user)),
        }))
      )
    }

    function onNewGame(game: Game) {
      setChats((chats) =>
        chats.map((chat) =>
          chat._id === game.chat ? { ...chat, messages: [...chat.messages, { ...game, type: "game" }] } : chat
        )
      )
    }

    function onGameUpdate(game: Game) {
      setChats((chats) =>
        chats.map((chat) =>
          chat._id === game.chat
            ? {
                ...chat,
                messages: chat.messages.map((message) =>
                  message.game && message.game._id === game._id
                    ? { ...message, game: { ...game, message: message.game.message } }
                    : message
                ),
              }
            : chat
        )
      )
    }

    socket.on("new-chat", onNewChat)
    socket.on("new-message", onNewMessage)
    socket.on("chat-update", onChatUpdate)
    socket.on("chat-delete", onChatDelete)
    socket.on("start-typing", onStartTyping)
    socket.on("stop-typing", onStopTyping)
    socket.on("user-connection", onUserConnection)
    socket.on("user-disconnection", onUserDisonnection)
    socket.on("new-game", onNewGame)
    socket.on("game-update", onGameUpdate)

    return () => {
      socket.off("new-chat", onNewChat)
      socket.off("new-message", onNewMessage)
      socket.off("chat-update", onChatUpdate)
      socket.off("chat-delete", onChatDelete)
      socket.off("start-typing", onStartTyping)
      socket.off("stop-typing", onStopTyping)
      socket.off("user-connection", onUserConnection)
      socket.off("user-disconnection", onUserDisonnection)
      socket.off("new-game", onNewGame)
      socket.off("game-update", onGameUpdate)
    }
  }, [])

  useEffect(() => {
    if (authUser) {
      socket.emit("login", authUser._id)
      
      // Try to connect socket, but start polling fallback if connection fails
      socket.connect()
      
      // Set up polling fallback for real-time updates
      let socketConnected = false
      let pollingSafetyTimer: NodeJS.Timeout
      let lastUpdateTime = new Date().toISOString()
      
      const checkSocketAndStartPolling = () => {
        if (socket.connected) {
          socketConnected = true
          pollingManager.stopAllPolling()
        } else {
          // Socket failed, start polling for messages
          pollingManager.startPolling('messages', async () => {
            if (!socketConnected) {
              try {
                const res = await axios.get(`/chat/updates?lastUpdate=${lastUpdateTime}`)
                const { chats: updatedChats, hasUpdates, timestamp } = res.data
                
                if (hasUpdates && updatedChats.length > 0) {
                  lastUpdateTime = timestamp
                  
                  setChats(currentChats => {
                    // Merge updated chats with current chats
                    const mergedChats = [...currentChats]
                    
                    updatedChats.forEach((updatedChat: Chat) => {
                      const existingIndex = mergedChats.findIndex(c => c._id === updatedChat._id)
                      if (existingIndex >= 0) {
                        mergedChats[existingIndex] = updatedChat
                      } else {
                        mergedChats.push(updatedChat)
                      }
                    })
                    
                    // Sort by last message time
                    return mergedChats.sort((a, b) => {
                      const aTime = a.messages?.length ? new Date(a.messages[a.messages.length - 1].createdAt) : new Date(a.createdAt)
                      const bTime = b.messages?.length ? new Date(b.messages[b.messages.length - 1].createdAt) : new Date(b.createdAt)
                      return bTime.getTime() - aTime.getTime()
                    })
                  })
                  
                  // Play notification sound for new messages
                  playPop()
                }
              } catch (error) {
                console.warn("Polling failed:", error)
              }
            }
          }, 3000)
        }
      }
      
      // Check socket connection after a delay
      pollingSafetyTimer = setTimeout(checkSocketAndStartPolling, 2000)
      
      // Listen for socket connection events
      socket.on('connect', () => {
        socketConnected = true
        pollingManager.stopAllPolling()
        clearTimeout(pollingSafetyTimer)
      })
      
      socket.on('disconnect', () => {
        socketConnected = false
        checkSocketAndStartPolling()
      })
      
      axios
        .get("/chat")
        .then((res) => {
          setChats(res.data)
          setLoading(false)
          lastUpdateTime = new Date().toISOString()
        })
        .catch((err) => console.log(err))
        
      return () => {
        clearTimeout(pollingSafetyTimer)
        pollingManager.stopAllPolling()
      }
    } else {
      setChats([])
      pollingManager.stopAllPolling()
    }
  }, [authUser])

  const contextValue = {
    chats,
    createMessage,
    createGame,
    loading,
    findChat,
    createChat,
    readMessages,
    updateChat,
    updateGameMessage,
  }

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
}

export function useChats() {
  return useContext(ChatContext)
}

export function useChat(chatId?: string) {
  const content = useContext(ChatContext)
  const chat = content.chats.find((chat) => chat._id === chatId)
  return { chat, ...content }
}
