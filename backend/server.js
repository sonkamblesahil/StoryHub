import express, { urlencoded } from 'express'
import cors from 'cors'
import dotenv  from 'dotenv'
import Storiesroutes from './routes/Storiesroutes.js'
import { connectDB } from './config/db.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.use('/',Storiesroutes)


app.listen(process.env.PORT || 3000, () => {
    connectDB()
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
})

