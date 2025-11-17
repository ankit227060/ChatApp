require("dotenv").config()
const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, { cors: { origin: process.env.CLIENT_BASE_URL } })
const mongoose = require("mongoose")
const cors = require("cors")
const passport = require("passport")
const compression = require("compression")
const helmet = require("helmet")
const RateLimit = require("express-rate-limit")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
const limiter = RateLimit({ windowMs: 1 * 60 * 1000, max: 300 })
app.use(limiter)
app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    optionsSuccessStatus: 200,
  })
)
app.use(passport.initialize())
app.use((req, res, next) => {
  req.io = io
  next()
})

app.use("/media/avatars", express.static("media/avatars"))
app.use("/media/images", express.static("media/images"))
app.use("/media/groups", express.static("media/groups"))

// connect to db
const mongoDb = process.env.MONGODB_URL
console.log("MongoDB URL configured:", mongoDb ? "Yes" : "No")
console.log("MongoDB URL (masked):", mongoDb ? mongoDb.replace(/:[^:@]*@/, ':****@') : "undefined")
console.log("Environment variables loaded:", Object.keys(process.env).length)

const main = async () => {
  try {
    await mongoose.connect(mongoDb, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000,
    })
    console.log("✅ MongoDB connected successfully")
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message)
    console.error("Error details:", error.name, error.code)
    throw error
  }
}

main()
  .then(() => console.log("db connected"))
  .catch((err) => {
    console.error("Database connection error:", err)
    console.log("MongoDB URL exists:", !!mongoDb)
    console.log("Error type:", err.name)
  })

const handlers = require("./handlers")

io.on("connection", (socket) => {
  socket.on("login", handlers.handleLogin)
  socket.on("start-typing", handlers.handleStartTyping)
  socket.on("stop-typing", handlers.handleStopTyping)
  socket.on("disconnect", handlers.handleDisconnect)
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Database connection test endpoint
app.get("/api/db-test", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }
    
    res.json({
      status: states[dbState] || 'unknown',
      mongodb_url_configured: !!process.env.MONGODB_URL,
      connection_state: dbState,
      database_name: mongoose.connection.name || 'none'
    })
  } catch (error) {
    res.status(500).json({
      error: "Database test failed",
      message: error.message,
      mongodb_url_configured: !!process.env.MONGODB_URL
    })
  }
})

const userRouter = require("./routes/user")
const messageRouter = require("./routes/message")
const chatRouter = require("./routes/chat")
const gameRouter = require("./routes/game")
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)
app.use("/api/chat", chatRouter)
app.use("/api/game", gameRouter)

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message })
})

const PORT = process.env.PORT || 3000

// For local development
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))
}

// Export for Vercel
module.exports = app
