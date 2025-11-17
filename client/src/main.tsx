import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import axios from "axios"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Set API base URL
const backendURL = import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:3000"
const baseURL = backendURL + "/api"
axios.defaults.baseURL = baseURL
axios.defaults.withCredentials = true

// Debug logging for environment variables
console.log("🔧 Environment:", import.meta.env.MODE)
console.log("🌐 Backend URL:", backendURL)
console.log("📡 API Base URL:", baseURL)
console.log("🔍 Raw VITE_SERVER_BASE_URL:", import.meta.env.VITE_SERVER_BASE_URL)
gsap.registerPlugin(ScrollTrigger)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
