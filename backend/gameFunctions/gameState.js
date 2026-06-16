//States - idle , playerturn , dealerturn , finished 

import { createShoe, dealCard } from "./deck.js";
import { evaluateHand } from "./hand.js";

export function createGameState() {
    return {
        shoe: createShoe(),
        state: "idle",
        playerHand: [],
        dealerHand: [],
        result: null
    }
}

export function startGame(currGameState) {
    currGameState.playerHand = []
    currGameState.dealerHand = []
    currGameState.result = null
    currGameState.state = "idle"
       
    for (let i = 0; i < 2; i++) {
        currGameState.playerHand.push(dealCard(currGameState.shoe));
        currGameState.dealerHand.push(dealCard(currGameState.shoe));
    }

    currGameState.state = "playerturn";

    return currGameState
}

export function hit(currGameState) {
    // if (currGameState.state !== "playing") throw new Error("Not your turn");
    currGameState.playerHand.push(dealCard(currGameState.shoe))
    return currGameState
}

export function stand(currGameState) {
    // if (currGameState.state !== "playing" ) throw new Error("Not your turn");
    currGameState.state = "dealerturn"
    return currGameState
}

export function doubleDown(currGameState) {
    // if (currGameState.state !== "playing") throw new Error("Not your turn") ;
    // if (currGameState.canDoubleDown === false) throw new Error("Double down is only available before first hit");
    currGameState.playerHand.push(dealCard(currGameState.shoe))
    currGameState.state = "dealerturn"
    return currGameState

}

export function determineWinner(currGameState) {
    const player = evaluateHand(currGameState.playerHand)
    const dealer = evaluateHand(currGameState.dealerHand)

    if (player.isBust) return 'dealer'
    if (dealer.isBust) return 'player'
    if (player.isBlackjack && !dealer.isBlackjack) return 'player'
    if (dealer.isBlackjack && !player.isBlackjack) return 'dealer'
    if (player.value > dealer.value) return 'player'
    if (dealer.value > player.value) return 'dealer'
    return 'push'
}


export function dealerTurn(currGameState) {
    currGameState.dealerHand.push(dealCard(currGameState.shoe))
    return currGameState


}

export function finishRound(currGameState){
    currGameState.result = determineWinner(currGameState)
    currGameState.state = "finished"
    return currGameState    

}

// export function split(currGameState) {

//     let PlayerHand = currGameState.playerHand
//     if (PlayerHand.lenght === 2 && (PlayerHand[0].rank === PlayerHand[1].rank) || (["K", "Q", "J", "10"].includes(PlayerHand[0].rank) && ["K", "Q", "J", "10"].includes(PlayerHand[0].rank))) {

//     }
// }







