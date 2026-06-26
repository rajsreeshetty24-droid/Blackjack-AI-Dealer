import { motion } from "framer-motion";
import { getCard } from "../utils/getCard.js";

export default function Card({ card, index = 0, owner = "player" }) {
  return (
    <motion.div
      className="card-inner"
      initial={{
        opacity: 0,
        scale: 0.2,
        x: owner === "dealer" ? 250 : -250,
        y: -100,
        rotate: owner === "dealer" ? 20 : -20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotate: 0,
      }}
      transition={{
        delay: index * 0.15,
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <img src={getCard(card)} alt="card" />
    </motion.div>
  );
}