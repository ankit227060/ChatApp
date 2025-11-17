const messageService = require("../services/message")
const asyncHandler = require("express-async-handler")
const { multerUpload } = require("../storage")

const upload = multerUpload("media/images")

exports.createMessage = [
  upload.array("images", 10),
  asyncHandler(async (req, res) => {
    try {
      console.log("📸 File upload info:", {
        fileCount: req.files?.length || 0,
        files: req.files?.map(f => ({
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
          hasBuffer: !!f.buffer,
          hasPath: !!f.path
        })) || []
      })

      const message = await messageService.createMessage({
        chatId: req.body.chatId,
        authUserId: req.user._id,
        text: req.body.text,
        files: req.files || [],
        game: req.game,
        io: req.io,
      })

      res.json(message)
    } catch (err) {
      console.error("❌ Message creation error:", err)
      res.status(err.status || 500).json({ 
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
      })
    }
  }),
]
