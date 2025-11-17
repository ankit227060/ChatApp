import { io } from "socket.io-client"

const URL = import.meta.env.MODE === "production" ? import.meta.env.VITE_SERVER_BASE_URL : "http://localhost:3000"

export const socket = io(URL, { 
  autoConnect: false,
  // Fallback to polling if WebSocket fails (for serverless environments)
  transports: ['websocket', 'polling'],
  timeout: 5000,
  forceNew: true
})

// Polling fallback for real-time updates when Socket.io isn't available
class PollingManager {
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private callbacks: Map<string, Function[]> = new Map()
  
  startPolling(eventName: string, pollFunction: Function, interval: number = 3000) {
    if (this.intervals.has(eventName)) {
      this.stopPolling(eventName)
    }
    
    const intervalId = setInterval(async () => {
      try {
        await pollFunction()
      } catch (error) {
        console.warn(`Polling error for ${eventName}:`, error)
      }
    }, interval)
    
    this.intervals.set(eventName, intervalId)
  }
  
  stopPolling(eventName: string) {
    const intervalId = this.intervals.get(eventName)
    if (intervalId) {
      clearInterval(intervalId)
      this.intervals.delete(eventName)
    }
  }
  
  stopAllPolling() {
    this.intervals.forEach((intervalId) => clearInterval(intervalId))
    this.intervals.clear()
  }
}

export const pollingManager = new PollingManager()
