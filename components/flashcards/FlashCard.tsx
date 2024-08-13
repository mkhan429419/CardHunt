'use client'
import React, { useState } from 'react'

type CardProps = {
  id: number,
  front: string,
  back: string
}

const FlashCard = ({ card }: { card: CardProps }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  }

  return (
    <div
      key={card.id}
      className={`perspective p-4 bg-[#FFEDD5] rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out hover:cursor-pointer ${
        isFlipped ? 'flip-card' : ''
      } min-h-28 text-center` }
      onClick={handleCardClick}
    >
      <div className={`relative transition-transform duration-500 ease-in-out transform ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className={`absolute inset-0 flex items-center justify-center backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-gray-700 m-auto">{card.front}</div>
        </div>
        <div className={`absolute inset-0 flex items-center justify-center backface-hidden ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
          <div className=" font-semibold text-lg m-auto">{card.back}</div>
        </div>
      </div>
    </div>
  )
}

export default FlashCard
