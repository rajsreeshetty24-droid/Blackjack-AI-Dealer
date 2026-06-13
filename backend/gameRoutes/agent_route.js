import { Router } from "express";
import { createGameState } from "../gameFunctions/gameState.js";
import { runAgent } from "../agent/agent.js";

const agent_router = Router()

agent_router.post("/message" , async (req , res) => {
    if (!req.session.game){
        req.session.game = createGameState()
    }

    const {message} = req.body

    const result = await runAgent(message , req.session.game)
    res.json({
        dealerMessage: result.dealerMessage,
        gameState: result.gameState,
        // statehistory: result.statehistory
    })
})

export default agent_router;