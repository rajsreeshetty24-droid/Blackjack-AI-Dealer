import Card from "./Card";
import "./PlayerHandArea.css"

export default function PlayerHandArea({playercards}) {

    if (!playercards) return null


    return (
        <div className="player-area">
                {playercards.map((card , index) => (
                    <Card key ={index} card={card} />
                )) 
            }
        </div>
    )
}