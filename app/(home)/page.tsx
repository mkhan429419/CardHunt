'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

const Homepage = () => {
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setLoading(true);
  };

  return (
    <div className="space-y-10 items-center m-auto w-4/5 pt-20">
      <h1 className="text-5xl font-bold text-center">
        Welcome to Card Hunt!
      </h1>
      <p className="text-xl font-light mt-4 text-center">
        Create, manage, and learn with flashcards tailored to your needs.
      </p>

      <div className="flex justify-center mt-8">
        <Link href="/new-flashcard" onClick={handleGetStarted}>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
            disabled={loading}
          >
            {loading ? <Spinner>Loading...</Spinner> : 'Get Started'}
          </button>
        </Link>
      </div>

      <div className="mt-16">
        <div className="p-8 bg-[#FFEDD5] rounded-lg text-center">
          <h2 className="text-3xl font-semibold">✨ Join Premium</h2>
          <p className="mt-4 text-xl font-light">
            Unlock unlimited flashcards and storage with our premium plan. With a free account, you can only store up to 10 cards per collection.
          </p>
          <Link href="/premium">
            <button className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
              Go Premium
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
