import Card from "./Card"
import "./DealerHandArea.css"

export default function DealerHandArea({dealercards}) {
    
    if (!dealercards) return null

    
    return (
        <div className="dealer-area">
            {dealercards.map((card , index) => 
            <Card key={index}  card={card}/>)}
        </div>
    )
}