"use client";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";

interface Flashcard {
  front: string;
  back: string;
}

const FlippableCard: React.FC<{ flashcard: Flashcard }> = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const flip = () => setIsFlipped(!isFlipped);

  return (
    <motion.div
      className="relative w-full h-60 cursor-pointer perspective"
      onClick={flip}
    >
      <motion.div
        className={`absolute inset-0 w-full h-full rounded-lg shadow-lg transition-transform duration-1000 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full rounded-lg backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex flex-col justify-center items-center h-full w-full p-6 bg-gradient-to-r from-pink-100 to-purple-100 border border-gray-300 shadow-lg rounded-lg">
            <p className="text-xl font-bold text-purple-700 mb-4">
              {flashcard.front}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 w-full h-full rounded-lg backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex flex-col justify-center items-center h-full w-full p-6 bg-gradient-to-r from-purple-100 to-pink-100 border border-gray-300 shadow-lg rounded-lg">
            <p className="text-md text-gray-700 italic">{flashcard.back}</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

interface CarouselProps {
  flashcards: Flashcard[];
}

const CarouselComponent: React.FC<CarouselProps> = ({ flashcards }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="
        w-full
        overflow-hidden
        md:overflow-visible
      "
    >
      <CarouselContent>
        {flashcards.map((flashcard, index) => (
          <CarouselItem key={index} className="basis-1/2">
            <FlippableCard flashcard={flashcard} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CarouselComponent;
