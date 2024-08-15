'use client'
import { auth } from '@/auth';
import FlashCard from '@/components/flashcards/FlashCard';
import { Spinner } from '@/components/ui/spinner';
import { FlashcardCollection, FlashcardData } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const FlashcardCollectionsPage = () => {
  const [collections, setCollections] = useState<FlashcardCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  

  useEffect(() => {
    const fetchCollections = async () => {
        try{
            const authenticatedUser = await auth();
            if (!authenticatedUser) {
               toast.error('You must be signed in to view flashcard collections');
            }
        }catch
        (error){
            console.error(error);
        }
      try {
        const response = await fetch('/api/flashcard-collections', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch flashcard collections');
        }

        const data = await response.json();
        setCollections(data);
      } catch (err:any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleCollectionClick = (flashcards: FlashcardData[]) => {
    setFlashcards(flashcards);
  }

  if (loading) return (<div className='items-center justify-center m-auto mt-20'><Spinner>Loading...</Spinner></div>);
  if (error) return toast.error(error);

  return (
    <div>
      <div className="space-y-10 items-center m-auto w-4/5 pt-10">
            <h1 className="text-4xl font-semibold">
              {" "}
              📚 Your Flashcard Collections   {" "}
            </h1>
            <p className="text-xl font-light mt-4 leading-8">
            Here are your flashcard collections. Click on a collection to view the flashcards in it.
            </p>
            { loading ?   <Spinner>Loading...</Spinner> : collections.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <div key={collection.id} className="flex items-center justify-center p-10 bg-[#FFEDD5] rounded-lg cursor-pointer"
                  onClick={()=>handleCollectionClick(collection.flashcards)}>
                    <p className='text-lg sm:text-xl'>{collection.name}</p>
                  
                  </div>
                ))}
              </div>
            ) :
            <div>
                 <p className="text-xl font-light mt-4 leading-8">
            You don't have any card collection. <span className="text-blue-400 underline"><Link href="/new-flashcard">
            Click here to create one.
            </Link></span>
            </p>
            </div>}
            {
                flashcards && flashcards.length > 0 && 
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcards.map((card) => (
                  <div key={card.id} className="flex items-center justify-center">
                    <FlashCard card={card} />
                  </div>
                ))}
              </div>
            }
          </div>
    </div>
  );
};

export default FlashcardCollectionsPage;
