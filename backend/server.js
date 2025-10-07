import express, { urlencoded } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import compression from 'compression'
import path from 'path'
import { fileURLToPath } from 'url'
import Storiesroutes from './routes/Storiesroutes.js'
import { connectDB } from './config/db.js'

dotenv.config()

const app = express()

// Security and performance middleware
app.use(helmet())
app.use(compression())

// Configure CORS from env (comma-separated list) or allow same-origin by default
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((o) => o.trim())
  : undefined
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)
app.use(express.json())
app.use(urlencoded({ extended: true }))

// API routes mounted under /api to avoid clashing with SPA routes
app.use('/api', Storiesroutes)


// Serve frontend static files in production
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.resolve(__dirname, '../frontend/dist')
app.use(express.static(distPath))

// SPA fallback for routes not starting with /api (Express 5-safe regex)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

connectDB().then(
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
  })
)

