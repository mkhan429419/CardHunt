'use client'
import React, { useEffect, useState } from 'react';
import FlashCard from "@/components/flashcards/FlashCard";
import Generate from "@/components/flashcards/GenerateFlashcardBar";
import { Button } from "@/components/ui/button";
import { generateFlashcards } from '@/lib/utils/generateFlashcard';
import { FlashcardContent } from '@/types';

type Props = {};

const Flashcards = (props: Props) => {
 const [flashcards, setFlashcards] = useState<FlashcardContent[]>([]);

 useEffect(() => {
    // Define an async function to fetch flashcards
    const fetchFlashcards = async () => {
      try {
        const data = await generateFlashcards("Solar System");
        if (data) {
          setFlashcards(data);
        } else {
          console.error('No flashcards data received');
        }
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };
    
    fetchFlashcards();
  }, []);
 

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
