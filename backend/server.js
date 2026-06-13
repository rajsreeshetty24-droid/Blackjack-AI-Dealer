import express from "express"
import cors from "cors"
import session from "express-session"
import agentRoute from "./gameRoutes/agent_route.js"


const app = express()
const PORT = 3001

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())

app.use(session({
    secret: 'blackjack',
    resave: false,
    saveUninitialized: true,
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
