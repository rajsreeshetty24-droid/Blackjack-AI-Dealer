export function evaluateHand(hand) {
    let score = 0
    let acecnt = 0
    for (const card of hand) {
        if (card.rank === "A"){
            score += 11
            acecnt += 1
        }
        else if (["J" , "Q" , "K"].includes(card.rank)) {
            score += 10
        }

        else {
            score += parseInt(card.rank)
        }
    }

    while ( score > 21 && acecnt > 0){
        score -= 10
        acecnt -= 1
    }

    return {
        value: score,
        isSoft : acecnt > 0,
        isBust : score > 21 ,
        isBlackjack : hand.length === 2 && score === 21  
    }

}

