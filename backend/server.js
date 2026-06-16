import express from "express"
import cors from "cors"
import session from "express-session"
import agentRoute from "./gameRoutes/agent_route.js"
import { createClient} from "redis";
import { RedisStore } from "connect-redis";
import cookieParser from "cookie-parser"

process.on('warning', e => console.warn(e.stack));

const port = process.env.PORT

const app = express()
app.set("trust proxy" , 1)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({
    origin: ["https://blackjack-ai-dealer.vercel.app" , "http://localhost:5173"], //Try with or without slash
    credentials: true
}))


const redis = createClient({
    url: process.env.REDIS_URL
})

redis.on('error' , (err)=> console.log("Redis error:" , err))

async function startServer() {
    await redis.connect()
    console.log("Redis connected")

    app.use(session({
        store: new RedisStore({ client: redis }),
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }
    }))

    app.use("/api/agent", agentRoute)

    app.listen(port, () => {
        console.log(`The server is running on http://localhost:${port}`)
    })

}

// app.use("/api/game" , gameRoutes)


startServer().catch(console.error)



