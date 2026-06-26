import Card from "./Card";
import "./PlayerHandArea.css";

export default function PlayerHandArea({ playercards }) {
    if (!playercards) return null;

    return (
        <div className="player-area">
            {playercards.map((card, index) => (
                <Card
  key={`${card.rank}-${card.suite}-${index}`}
  card={card}
  index={index}
  owner="player"
/>
            ))}
        </div>
    );
}