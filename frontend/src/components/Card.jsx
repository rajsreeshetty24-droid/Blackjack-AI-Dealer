import {getCard} from "../utils/getCard.js"


export default function Card({card}) {


    // const handleClick = () => {
    //     if (onClick) onClick()
    // }

    return(

        <div className="card-inner">
            <img src={getCard(card)} alt={card} />
        </div>
    )
}


// import { useState, useEffect } from "react"
// import { getCard } from "../utils/getCard.js"

// export default function Card({ card, revealOn, gameStatus }) {
//     const [revealed, setRevealed] = useState(!revealOn) // if revealOn exists, start face down

//     useEffect(() => {
//         if (revealOn && gameStatus === revealOn) {
//             setRevealed(true)
//         }
//     }, [gameStatus, revealOn])

//     return (
//         <div className="card-inner">
//             {revealed
//                 ? <img src={getCard(card)} alt={card} />
//                 : <img src="/assets/reverse_green.svg" alt="card-back" />
//             }
//         </div>
//     )
// }