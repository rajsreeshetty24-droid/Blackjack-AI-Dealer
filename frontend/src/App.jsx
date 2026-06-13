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
    const data = await fetch("http://localhost:3001/api/agent/message", {
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
    <div className="p-8 relative">

      <div className="flex items-start gap-4 mb-8 ml-4">
        <Avatar className="size-24 shrink-0">
          <AvatarImage src="/dealer.png" alt="Dealer" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className='flex-1'>
          {isloading ? (
            <div className='inline-flex rounded-xl border bg-background px-4 py-2'>
              <TypingIndicator />
            </div>
          ) : (
            <div className='inline-block max-w-4xl rounded-xl border bg-background px-4 py-3'>
              <p className="text-lg text-muted-foreground select-none">
                {dealerMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* {isloading && <p className="mt-6 border-l-2 pl-6 italic">Dealer action in progress...</p>} */}

      <div className='flex gap-8'>
        <div className='flex-1 ml-8 flex flex-col gap-10 select-none'>
          <DealerHandArea dealercards={gameState?.dealerHand} />
          <PlayerHandArea playercards={gameState?.playerHand} />
        </div>

        <div className='flex flex-col items-end gap-10 mr-8 select-none'>

          <Deck className="w-45" />

          <div className='flex flex-col gap-3 w-48'>
            <Button className="w-full text-xl" disabled = {isloading} onClick={() => sendMessage("Start a new game")}>Start</Button>
            <Button className="w-full text-xl" disabled = {isloading} onClick={() => sendMessage("Hit")}>Hit</Button>
            <Button className="w-full text-xl" disabled = {isloading} onClick={() => sendMessage("Double Down")}>Double Down</Button>
            <Button className="w-full text-xl" disabled = {isloading} onClick={() => sendMessage("stand")}>Stand</Button>
          </div>

        </div>
      </div>
    </div>

  )
}

export default App
