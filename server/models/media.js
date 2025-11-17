const mongoose = require("mongoose")
const Schema = mongoose.Schema

// can be either an image or a link

const mediaSchema = new Schema({
  type: { type: String, required: true },
  url: { type: String, required: true },
  filename: { type: String }, // Original filename
  mimetype: { type: String }, // MIME type
  size: { type: Number }, // File size in bytes
  from: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  chat: { type: mongoose.Types.ObjectId, ref: "Chat", required: true },
  timestamp: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Media", mediaSchema)
