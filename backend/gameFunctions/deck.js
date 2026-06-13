const noofdeck = 6 

function build_deck() {
    const suite = ["clover", "club", "diamond", "heart"]
    const rank = ['A' , '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J' , 'Q', 'K']
    let deck = []
    for (let i = 0 ; i<suite.length ; i++){
        for (let j = 0 ; j <rank.length ; j++){
            deck.push({suite: suite[i] , rank:rank[j]})
        }
    }
    return deck
}
export function shuffle(cards) {
    const d = [...cards];
    for (let i = d.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [d[i], d[j]] = [d[j], d[i]];
    }
    return d;
}

export function createShoe(Numberofdeck = noofdeck){
    const allCards = []
    for (let i = 0 ; i < Numberofdeck ; i ++){
        allCards.push(...build_deck())
    }
    const shuffledCards = shuffle(allCards)

    const cutPosition = Math.floor(shuffledCards.length * (0.65+Math.random()*0.10))

    return {
        cards: shuffledCards,
        cutPosition,
        Numberofdeck,
        cardCount:0
    }

}


export function dealCard(shoe){
    shoe.cardCount++
    return shoe.cards.shift()
}

export function needsReshuffle(shoe){
    return shoe.cardCount >= shoe.cutPosition || shoe.cards.length < 10
}

export function addCards(shoe){
    const newShoe = createShoe(shoe.Numberofdeck)
    shoe.cards = newShoe.cards
    shoe.cutPosition = newShoe.cutPosition
    shoe.cardCount = 0
    return shoe
}

