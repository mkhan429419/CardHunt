import { getOwnerFlashcardCollections } from "@/lib/server-actions";
import Link from "next/link";
import React from "react";
import { PiPlus } from "react-icons/pi";

const MyCards = async () => {
  const cards = await getOwnerFlashcardCollections();
  return (
    <div className="mx-auto lg:w-3/5 py-10 px-6">
      {cards.length === 0 ? (
        <div>
          <h1 className="text-3xl font-bold">No card sets found</h1>
          <p className="text-gray-500">
            Looks like you have not created any card sets yet, click the button
            to get started.
          </p>
          <Link href={"/new-flashcard"}>
            <div className="bg-[#ff6154] text-white p-4 rounded-md mt-4 w-60 h-56 flex items-center justify-center flex-col">
              <PiPlus className="text-3xl mb-4" />
              <p className="text-lg">Create a card set</p>
            </div>
          </Link>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold">Your Card Sets</h1>
          <p>Manage your card sets here</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {cards.map((card) => (
              <Link href={`/edit/${card.id}`} key={card.id}>
                <div className="rounded-lg hover:scale-105 transition-transform duration-300 transform ease-in-out border p-6 shadow-sm bg-gradient-to-r from-orange-100 via-orange-200 to-orange-100 min-h-[200px]">
                  <h2 className="text-2xl font-semibold mb-2 truncate">
                    {card.name}
                  </h2>
                  <h3 className="text-lg font-medium text-gray-600 mb-2 truncate">
                    {card.headline}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {card.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCards;
