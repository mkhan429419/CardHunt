import AllFlashcards from "@/components/all-flashcards";
import { getAllFlashcardCollections } from "@/lib/server-actions";

const CardDisplay = async () => {
  const flashcardCollections = await getAllFlashcardCollections();

  console.log(flashcardCollections, "flashcard collections here");

  return (
    <>
      <div className="md:w-3/5 mx-auto py-10 px-6">
        <AllFlashcards flashcardCollections={flashcardCollections} />
      </div>
    </>
  );
};

export default CardDisplay;
