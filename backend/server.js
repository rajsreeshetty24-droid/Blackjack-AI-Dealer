import express from "express"
import cors from "cors"
import session from "express-session"
import agentRoute from "./gameRoutes/agent_route.js"
import { createClient} from "redis";
import { RedisStore } from "connect-redis";

process.on('warning', e => console.warn(e.stack));


const app = express()
app.set('trust proxy', 1)
const PORT = 3001

const redis = createClient({
    url: process.env.REDIS_URL
})

redis.connect().catch(console.error());

redis.on('error' , (err)=> console.log("Redis error:" , err))
redis.on('connect' , ()=> {console.log("Redis connected")})

app.use(cors({
    origin: "https://blackjack-ai-dealer.vercel.app",
    credentials: true
}))

app.use(express.json())

app.use(session({
    store : new RedisStore({client: redis}),
    secret: 'blackjack',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true , 
        sameSite: 'none'
    }
}))

// app.use("/api/game" , gameRoutes)
app.use("/api/agent" , agentRoute)

app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`)
})
