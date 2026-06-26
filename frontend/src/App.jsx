import { useState } from 'react'
import PlayerHandArea from './components/PlayerHandArea'
import DealerHandArea from './components/DealerHandArea'
import './App.css'
import { Button } from './components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar'
import TypingIndicator from './components/TypingIndicator'
import Deck from './components/Deck'

function App() {

  const [dealerMessage, setDealerMessage] = useState("Hi, Ready to play a round of Blackjack?")
  const [gameState, setGameState] = useState(null)
  const [isloading, setIsloading] = useState(false)

  const sendMessage = async (message) => {
    setIsloading(true)
    const data = await fetch("https://blackjack-ai-dealer.onrender.com/api/agent/message", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ message })
    })
    const result = await data.json()

    setDealerMessage(result.dealerMessage)
    setGameState(result.gameState)
    setIsloading(false)


  }


  return (
    <div className="h-screen overflow-hidden bg-green-900 text-white p-8 relative">
      <div className="flex justify-center mb-10">
    <div className="flex flex-col items-center gap-4">

        <Avatar className="size-24">
            <AvatarImage src="/dealer.png" alt="Dealer" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        {isloading ? (
            <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3">
                <TypingIndicator />
            </div>
        ) : (
            <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 max-w-3xl">
                <p className="text-lg text-white text-center">
                    {dealerMessage}
                </p>
            </div>
        )}

    </div>
</div>

      {/* {isloading && <p className="mt-6 border-l-2 pl-6 italic">Dealer action in progress...</p>} */}

        <div className="flex items-center justify-center gap-24 mt-16">
  
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">DEALER</h2>
            <DealerHandArea dealercards={gameState?.dealerHand} />
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold mb-6">DECK</h1>
            <Deck className="w-30" />
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">PLAYER</h2>
           <PlayerHandArea playercards={gameState?.playerHand} />
          </div>
        </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
            <Button className="px-8 py-6 rounded-full text-lg shadow-lg hover:scale-105 transition" disabled = {isloading} onClick={() => sendMessage("Start a new game")}>Start</Button>
            <Button className="px-8 py-6 rounded-full text-lg shadow-lg hover:scale-105 transition" disabled = {isloading} onClick={() => sendMessage("Hit")}>Hit</Button>
            <Button className="px-8 py-6 rounded-full text-lg shadow-lg hover:scale-105 transition" disabled = {isloading} onClick={() => sendMessage("Double Down")}>Double Down</Button>
            <Button className="px-8 py-6 rounded-full text-lg shadow-lg hover:scale-105 transition" disabled = {isloading} onClick={() => sendMessage("stand")}>Stand</Button>
      </div>
    </div>

  )
}

export default App
