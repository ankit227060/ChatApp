const multer = require("multer")
const path = require("path")

const types = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"]

// Use memory storage for serverless environments
function createMemoryStorage() {
  return multer.memoryStorage()
}

// Use disk storage for local development
function createDiskStorage(destinationPath) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationPath)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      cb(null, uniqueSuffix + "-" + file.originalname)
    },
  })
}

exports.multerUpload = function upload(destinationPath) {
  // Use memory storage in production (serverless) or disk storage in development
  const storage = process.env.NODE_ENV === 'production' || process.env.VERCEL 
    ? createMemoryStorage() 
    : createDiskStorage(destinationPath)
    
  return multer({
    storage: storage,
    limits: { fileSize: 2500000 }, // 2.5MB limit
    fileFilter: (req, file, cb) => {
      if (!types.includes(file.mimetype)) {
        return cb(new Error("File type is not allowed"))
      }
      cb(null, true)
    },
  })
}
