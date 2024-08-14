'use client'
import React, { useEffect } from 'react';
import FlashCard from "@/components/flashcards/FlashCard";
import Generate from "@/components/flashcards/GenerateFlashcardBar";
import { Button } from "@/components/ui/button";
import { generateFlashcards } from '@/lib/utils/generateFlashcard';

type Props = {};

const Flashcards =async (props: Props) => {
  const flashcards = [
    { id: 1, back: "React", front: "A JavaScript library for building user interfaces." },
    { id: 2, back: "Tailwind CSS", front: "A utility-first CSS framework for rapid UI development." },
    { id: 3, back: "Next.js", front: "A React framework for building modern web applications." },
    { id: 4, back: "TypeScript", front: "A typed superset of JavaScript that compiles to plain JavaScript." },
    { id: 5, back: "GraphQL", front: "A query language for your API." },
    { id: 6, back: "React", front: "A JavaScript library for building user interfaces." },
    { id: 7, back: "Tailwind CSS", front: "A utility-first CSS framework for rapid UI development." },
    { id: 8, back: "Next.js", front: "A React framework for building modern web applications." },
    { id: 9, back: "TypeScript", front: "A typed superset of JavaScript that compiles to plain JavaScript." },
    { id: 10, back: "GraphQL", front: "A query language for your API." },
  ];

  useEffect(()=>{
    const flashcard =  generateFlashcards("Solar System");
    console.log(flashcard);

  }, [])
 

  return (
    <>
      <div className="mx-auto py-10 px-6 lg:w-3/5">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-grow w-full">
            <Generate />
          </div>
          <Button className="bg-red text-white w-full sm:w-auto">
            Generate
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((card) => (
            <div key={card.id} className="flex items-center justify-center">
              <FlashCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Flashcards;
