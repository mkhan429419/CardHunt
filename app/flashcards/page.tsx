'use client'
import React, { useState } from 'react';
import FlashCard from "@/components/flashcards/FlashCard";
import Generate from "@/components/flashcards/GenerateFlashcardBar";
import { Button } from "@/components/ui/button";
import { generateFlashcards } from '@/lib/utils/generateFlashcard';
import { FlashcardContent } from '@/types';
import { toast } from "sonner"

interface FlashcardsProps {
  setFlashcardsInParent?: React.Dispatch<React.SetStateAction<FlashcardContent[]>>;
}

const Flashcards: React.FC<FlashcardsProps> = ({ setFlashcardsInParent }) => {
  const [flashcards, setFlashcards] = useState<FlashcardContent[]>([]);
  const [topic, setTopic] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerateClick = async () => {
    if (!topic) {
      toast.error('No topic specified');
      return;
    }

    setLoading(true);
    try {
      const data = await generateFlashcards(topic);
      if (data) {
        setFlashcards(data);
        setFlashcardsInParent?.(data);
      } else {
        toast.error('No flashcards data received');
      }
    } catch (error) {
      toast.error('Error fetching flashcards');
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto py-10 px-6 w-full">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-grow w-full">
          <Generate onTopicChange={setTopic} />
        </div>
        <Button 
          className="bg-red text-white w-full sm:w-auto"
          onClick={handleGenerateClick}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
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
  );
};

export default Flashcards;
