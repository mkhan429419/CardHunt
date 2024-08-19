'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type CardProps = {
  id: string;
  front: string;
  back: string;
};

const FlashCard = ({ card }: { card: CardProps }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  // Function to calculate font size based on text length
  const calculateFontSize = (text: string, baseSize: number, minSize: number) => {
    const length = text.length;
    const size = baseSize - (length * 0.2); // Adjust the multiplier as needed
    return size < minSize ? minSize : size;
  };

  const frontFontSize = calculateFontSize(card.front, 24, 16); // Base size 24px, min size 16px
  const backFontSize = calculateFontSize(card.back, 20, 14); // Base size 20px, min size 14px

  return (
    <Card
      className={cn(
        'relative w-72 h-48 perspective cursor-pointer',
        'shadow-xl rounded-xl overflow-hidden',
        'transform transition-transform hover:scale-105', // Add a hover effect for a slight scale
      )}
      style={{ perspective: '1000px' }}
      onClick={handleCardClick}
    >
      <motion.div
        className="relative w-full h-full"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face of the card */}
        <motion.div
          className={cn(
            'absolute w-full h-full rounded-lg flex flex-col items-center justify-center p-4',
            'bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400', // Light orange gradient background
            'shadow-lg',
          )}
          style={{
            backfaceVisibility: 'hidden',
            opacity: isFlipped ? 0 : 1,
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div className="text-center">
            <h2
              className="text-white font-bold mb-2 break-words"
              style={{ fontSize: `${frontFontSize}px` }}
            >
              {card.front}
            </h2>
            <p className="text-white text-sm italic">
              Tap to reveal the answer
            </p>
          </div>
        </motion.div>

        {/* Back face of the card */}
        <motion.div
          className={cn(
            'absolute w-full h-full rounded-lg flex flex-col items-center justify-center p-4',
            'bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600', // Slightly darker gradient for the back face
            'shadow-lg',
          )}
          style={{
            backfaceVisibility: 'hidden',
            opacity: isFlipped ? 1 : 0,
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center">
            <p
              className="text-white font-semibold break-words"
              style={{ fontSize: `${backFontSize}px` }}
            >
              {card.back}
            </p>
            <p className="text-white text-sm italic mt-2">
              Tap to go back
            </p>
          </div>
        </motion.div>
      </motion.div>
    </Card>
  );
};

export default FlashCard;
