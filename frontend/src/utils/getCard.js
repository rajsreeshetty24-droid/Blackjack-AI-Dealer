export function getCard(card) {
    if (!card) {
        return "/assets/reverse_green.svg";
    }

    if (card.suite === "?" && card.rank === "?") {
        return "/assets/reverse_green.svg";
    }

    return `/assets/${card.suite}_${card.rank}.svg`;
}