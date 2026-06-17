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

    console.log('Game state keys:', Object.keys(req.session.game));
    console.log('Shoe card count:', req.session.game?.shoe?.cards?.length);

    // console.log(res.json(req.session))

    res.json({
        dealerMessage: result.dealerMessage,
        gameState: result.gameState,
        // statehistory: result.statehistory
    })
    
})

agent_router.get("/debug-session", (req, res) => {
    res.json(req.session);
});

export default agent_router;