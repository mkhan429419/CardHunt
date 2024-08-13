'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';

type CardProps = {
  id: number,
  front: string,
  back: string
}

const FlashCard = ({ card }: { card: CardProps }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="relative w-64 h-40 perspective" // Ensure perspective for 3D effect
      style={{ perspective: '1000px' }} // Perspective for depth
      onClick={handleCardClick}
    >
      <motion.div
        className="relative w-full h-full"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }} // Preserve 3D space
      >
        {/* Front face of the card */}
        <motion.div
          className="absolute w-full h-full bg-[#FFEDD5] rounded-lg flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            opacity: isFlipped ? 0 : 1,
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <div className="text-gray-700 text-center">{card.front}</div>
        </motion.div>

        {/* Back face of the card */}
        <motion.div
          className="absolute w-full h-full bg-[#FFEDD5] rounded-lg flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            opacity: isFlipped ? 1 : 0,
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-gray-700 font-semibold text-lg">{card.back}</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FlashCard;
