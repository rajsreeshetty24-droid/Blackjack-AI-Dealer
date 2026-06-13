import { Router } from "express";
import { createGameState, doubleDown, hit, stand, startGame } from "../gameFunctions/gameState.js";
import { evaluateHand } from "../gameFunctions/hand.js";

const router = Router()
router.post('/start', (req , res) => {
    req.session.game = createGameState();
    startGame(req.session.game)
    const playerHandDetails = evaluateHand(req.session.game.playerHand)
    res.json({
        playerScore: playerHandDetails.value,
        playerHand : req.session.game.playerHand,
        isBlackjack : playerHandDetails.isBlackjack,
        dealerHand : [req.session.game.dealerHand[0] , { suite: "?" , rank : "?"}],
        state: req.session.game.state

    })
})

router.post('/hit', (req, res) => {
    hit(req.session.game)
    const playerHandDetails = evaluateHand(req.session.game.playerHand)
    res.json({
        playerHand : req.session.game.playerHand,
        playerScore : playerHandDetails.value,
        isSoft : playerHandDetails.isSoft,
        isBust : playerHandDetails.isBust,
        isBlackjack : playerHandDetails.isBlackjack,
        state : req.session.game.state

    })
})

router.post('/stand', (req, res) => {
    stand(req.session.game)
    const playerHandDetails = evaluateHand(req.session.game.playerHand)
    const dealerHandDeatails = evaluateHand(req.session.game.dealerHand)
    res.json({
        playerHand: req.session.game.playerHand,
        dealerHand: req.session.game.dealerHand,
        playerScore: playerHandDetails.value,
        dealerScore: dealerHandDeatails.value,
        result: req.session.game.result,
        state: req.session.game.state

    })
})

router.post('/doubledown', (req, res) => {
    doubleDown(req.session.game)
    const playerHandDetails = evaluateHand(req.session.game.playerHand)
    const dealerHandDeatails = evaluateHand(req.session.game.dealerHand)
    res.json({
        playerHand: req.session.game.playerHand,
        dealerHand: req.session.game.dealerHand,
        playerScore: playerHandDetails.value,
        dealerScore: dealerHandDeatails.value,
        result: req.session.game.result,
        state: req.session.game.state

    })
})

export default router;