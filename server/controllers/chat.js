const chatService = require("../services/chat")
const asyncHandler = require("express-async-handler")
const { multerUpload } = require("../storage")
const { body } = require("express-validator")
const { handleFormValidation } = require("../utils")

const upload = multerUpload("media/groups")

const createChatValidation = [
  body("title").trim().isLength({ max: 50 }).withMessage("Chat title cannot exceed 50 characters").optional().escape(),
  body("desc")
    .trim()
    .isLength({ max: 300 })
    .withMessage("Chat description cannot exceed 50 characters")
    .optional()
    .escape(),
  body("members").isArray({ min: 2 }).withMessage("Chat members must be an array of at least 2 users").optional(),
]

exports.createChat = [
  ...createChatValidation,
  asyncHandler(async (req, res) => {
    handleFormValidation(req, res)
    const { title, desc, members } = req.body
    const chat = await chatService.createChat({
      title,
      desc,
      members,
      admin: req.user._id,
      authUserId: req.user._id,
      io: req.io,
    })
    res.json(chat)
  }),
]

exports.updateChat = [
  upload.single("image"),
  ...createChatValidation,
  asyncHandler(async (req, res) => {
    handleFormValidation(req, res)
    const { chatId } = req.params
    const { title, desc, members, image } = req.body
    const chat = await chatService.updateChat(chatId, req.user._id, title, desc, members, req.file, image, req.io)
    res.json(chat)
  }),
]

exports.getChatList = asyncHandler(async (req, res) => {
  const chats = await chatService.getChatList(req.user._id)
  res.json(chats)
})

exports.readChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params
  await chatService.readChat(req.user._id, chatId)
  res.json({ message: "Chat read successfully" })
})

exports.deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params
  await chatService.deleteChat({
    chatId,
    authUserId: req.user._id,
    io: req.io,
  })
  res.status(204).end()
})

// Polling endpoint for real-time updates fallback
exports.getRecentUpdates = asyncHandler(async (req, res) => {
  const { lastUpdate } = req.query
  const authUserId = req.user._id
  
  try {
    const recentChats = await chatService.getChatsForUser(authUserId)
    
    // If lastUpdate is provided, filter for chats updated after that time
    let filteredChats = recentChats
    if (lastUpdate) {
      const lastUpdateDate = new Date(lastUpdate)
      filteredChats = recentChats.filter(chat => 
        new Date(chat.updatedAt) > lastUpdateDate || 
        (chat.messages && chat.messages.length > 0 && 
         new Date(chat.messages[chat.messages.length - 1].createdAt) > lastUpdateDate)
      )
    }
    
    res.json({
      chats: filteredChats,
      hasUpdates: filteredChats.length > 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Polling update error:", error)
    res.status(500).json({ error: "Failed to get updates" })
  }
})

exports.removeUserFromChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.params
  await chatService.removeUserFromChat(chatId, userId, req.user._id, req.io)
  res.json({ message: "User removed with success" })
})
