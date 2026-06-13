import Groq from "groq-sdk";
import "dotenv/config.js"
import { evaluateHand } from "../gameFunctions/hand.js";
import { createGameState, dealerTurn, doubleDown, finishRound, hit, stand, startGame } from "../gameFunctions/gameState.js";
import { stdin as input, stdout as output } from "process";
import { createInterface } from "readline/promises";



const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

const readLine = createInterface({ input, output })


// const SYSTEM_PROMPT = `
// TOOLS:
// - get_game_state: check current state before acting
// - start_round: deal 2 cards to both
// - hit_player: deal card to player
// - stand_player: end player turn
// - double_down: player gets one card then dealer plays
// - dealer_hit: deal card to dealer
// - finish_round: determine winner

// RULES:
// - Always call get_game_state first
// - After hit_player: show hand, ask next move, STOP
// - After stand_player or double_down: call get_game_state then play dealer turn while explaining every hand dealer plays
// - Dealer hits below 17 or soft 17, stands on hard 17+
// - After finish_round: show both hands and result

// INVALID MOVES:
// - Not playing state: tell player to start a round
// - Double down after hit: only allowed on first 2 cards
// - Unknown action: list valid moves

// NARRATION:
// - Do not use "*" character , for the cards you can use the suite name istead of icons : "Ace of spades."
// - Hole card reveal: "I reveal [card]. My total is [score]."
// - Each dealer hit: "I draw [card]. Total is now [score]."
// - Round end: show both hands and winner clearly

// FORMATTING:
// - Do not use markdown formatting like ** or # or bullet points : "**hit** , **stand**."
// - Respond in plain conversational text only
// - Write naturally as if speaking out loud at a casino table
// `

const SYSTEM_PROMPT = `
TOOLS: get_game_state, start_round, hit_player, stand_player, double_down, dealer_hit, finish_round

FLOW:
- Always call get_game_state first
- After start_round: if player has blackjack, call finish_round immediately
- After hit_player: 
  - if player busts, call finish_round immediately (do not wait for stand)
  - otherwise show hand, ask next move, stop
- stand_player/double_down: play out dealer turn, narrating each draw briefly
- Dealer hits below 17 or soft 17, stands hard 17+
- finish_round: announce result concisely

ERRORS:
- Wrong state: tell player to start a round
- Double down after hit: only allowed on first 2 cards
- Unknown action: list valid moves

STYLE:
- Take input from button: "Click "Start" or click "Hit" or click "Double Down" or "Stand"."
- Plain text only, no markdown
- Be brief - 1-2 short sentences per message, max 3
- Don't repeat the full hand history, just the current relevant info and mention if busts
- Cards as "Ace of spades", not symbols
- Speak naturally like a casino dealer, not a report
- After finish_round: just say final scores and winner in one short line
`



const tools = [
    {
        type: 'function',
        function: {
            name: 'get_game_state',
            description: 'Get the current blackjack game state',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'hit_player',
            description: 'Deal one card to the player hand',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'stand_player',
            description: 'The user do not wish to get more cards , the dealer should play his turn now',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            }
        }
    },

    {
        type: 'function',
        function: {
            name: 'start_round',
            description: 'Start a new round by dealing 2 cards to player and dealer.',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            }
        }
    },

    {
        type: 'function',
        function: {
            name: 'double_down',
            description: 'Player doubles down. Only valid on first two cards.',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            }
        }
    },

    {
        type: 'function',
        function: {
            name: 'dealer_hit',
            description: 'Deal one card to the dealer , Hit until 17 but if we have an ace counted as 11 hit again',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            }
        }
    },

    {
        type: 'function',
        function: {
            name: 'finish_round',
            description: 'End the round and return the winner of that round',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            }
        }
    }
]

function get_game_state(gameState) {
    const playerCards = evaluateHand(gameState.playerHand)
    const dealerCards = evaluateHand(gameState.dealerHand)

    if (gameState.state === "dealerturn" || gameState.state === "finished")  
        return {
            playerHand: gameState.playerHand,
            dealerHand: gameState.dealerHand,
            playerScore: playerCards.value,
            dealerScore: dealerCards.value,
            isBust: dealerCards.isBust,
            isSoft: dealerCards.isSoft,
            isBlackjack: dealerCards.isBlackjack,
            state: gameState.state,
            result: gameState.result

        }  
    else
        return {
            playerHand: gameState.playerHand,
            dealerHand: [gameState.dealerHand[0], { suite: "?", rank: "?" }],
            playerScore: playerCards.value,
            isBust: playerCards.isBust,
            isSoft: playerCards.isSoft,
            isBlackjack: playerCards.isBlackjack,
            state: gameState.state,
            result: gameState.result

        }    
}


function hit_player(gameState) {
    hit(gameState)
    return get_game_state(gameState)
}

function stand_player(gameState) {
    stand(gameState)
    return get_game_state(gameState)
}

function start_round(gameState) {
    startGame(gameState)

    return get_game_state(gameState)
}

function double_down(gameState) {
    doubleDown(gameState)
    return get_game_state(gameState)
}

function dealer_hit(gameState) {
    dealerTurn(gameState)
    return get_game_state(gameState)
}

function finish_round(gameState) {
    finishRound(gameState)
    return get_game_state(gameState)

}


// function get_game_state(gameState) {
//     const player = evaluateHand(gameState.playerHand)
//     return `state:${gameState.state} player:${player.value}${player.isSoft ? 's' : ''} dealer:${gameState.dealerHand[0].rank} bust:${player.isBust} result:${gameState.result}`
// }

// function get_dealer_state(gameState) {
//     const dealer = evaluateHand(gameState.dealerHand)
//     return `dealerScore:${dealer.value} isSoft:${dealer.isSoft} isBust:${dealer.isBust} hand:${gameState.dealerHand.map(c => c.rank).join(',')}`
// }



// function hit_player(gameState) {
//     hit(gameState)
//     const player = evaluateHand(gameState.playerHand)
//     // just return what changed, not everything
//     return `dealt:${gameState.playerHand.at(-1).rank}${gameState.playerHand.at(-1).suite} playerScore:${player.value} isBust:${player.isBust}`
// }

// function dealer_hit(gameState) {
//     dealerTurn(gameState)
//     const dealer = evaluateHand(gameState.dealerHand)
//     return `dealt:${gameState.dealerHand.at(-1).rank}${gameState.dealerHand.at(-1).suite} dealerScore:${dealer.value} isSoft:${dealer.isSoft} isBust:${dealer.isBust}`
// }

// function start_round(gameState) {
//     startGame(gameState)
//     const player = evaluateHand(gameState.playerHand)
//     return `playerCards:${gameState.playerHand.map(c => c.rank + c.suite).join(',')} playerScore:${player.value} dealerVisible:${gameState.dealerHand[0].rank}${gameState.dealerHand[0].suite}`
// }

// function finish_round(gameState) {
//     finishRound(gameState)
//     return `result:${gameState.result}`
// }

// function stand_player(gameState) {
//     stand(gameState)
//     return `state:${gameState.state}`
// }

// function double_down(gameState) {
//     doubleDown(gameState)
//     const player = evaluateHand(gameState.playerHand)
//     return `dealt:${gameState.playerHand.at(-1).rank}${gameState.playerHand.at(-1).suite} playerScore:${player.value} state:${gameState.state}`
// }


function executetool(name, args, gameState) {
    if (name === "get_game_state") return get_game_state(gameState)
    if (name === "start_round") {
        return start_round(gameState)
    }
    if (name === "hit_player") {
        return hit_player(gameState)
    }
    if (name === "stand_player") {
        return stand_player(gameState)
    }
    if (name === "double_down") {
        return double_down(gameState)
    }

    if (name === "dealer_hit") {
        return dealer_hit(gameState)
    }
    if (name === "finish_round") {
        return finish_round(gameState)
    }
    throw new Error(`Unknown tool called : ${name}`)
}


// while (true){
//     const messages = [
//         { role: "system", content: SYSTEM_PROMPT },
//     ]

//     const userInput = await readLine.question("You:")
//     messages.push({ role: "user", content: userInput })

export async function runAgent(userMessage , gameState) {

    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
    ]

    // const statehistory = []

    while (true) {
        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages,
            tools,
        })

        const choice = response.choices[0]
        console.log(response.usage)
        messages.push(choice.message)

        if (choice.finish_reason === "stop") {
            
            return {
                dealerMessage: choice.message.content,
                gameState: get_game_state(gameState),
                // statehistory
            }
        }

        if (choice.finish_reason === "tool_calls") {
            // console.log("TOOL CALLS:", JSON.stringify(choice.message.tool_calls, null, 2))
            for (const toolcall of choice.message.tool_calls) {
                const result = executetool(
                    toolcall.function.name,
                    JSON.parse(toolcall.function.arguments),
                    gameState

                )

                // if (toolcall.function.name !=="get_game_state"){
                //     statehistory.push({
                //         name: toolcall.function.name,
                //         state: result
                //     })
                // }
                messages.push({
                    role: 'tool',
                    tool_call_id: toolcall.id,
                    content: JSON.stringify(result)
                })
            }
        }


    }

}


   






