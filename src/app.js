import express from "express"
// import connectDB from "./db"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credential:true
}))


app.use(express.json({limit:"16kb"}))

// for url data come  extended i.e. object nested
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// files storage img , file any one can access
app.use(express.static("public"))

app.use(cookieParser())


import userRouter from './routes/user.routes.js'
import auctionRoutes from './routes/auction.routes.js';
import bidsRoutes from './routes/bids.routes.js';
import notificationRoutes from './routes/notification.routes.js'

// routes declartation
app.use("/users",userRouter)
app.use("/auctions",auctionRoutes)
app.use("/bids",bidsRoutes)
app.use("/notification",notificationRoutes)
// localhost:3000/users/register
export {app}