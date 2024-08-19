import { getFlashcardCollectionBySlug } from "@/lib/server-actions";
import Image from "next/image";
import Link from "next/link";
import CarouselComponent from "@/components/carousel-component";

interface IParams {
  slug: string;
}

const FlashcardCollectionPage = async ({ params }: { params: IParams }) => {
  const flashcardCollection = await getFlashcardCollectionBySlug(params.slug);

  if (!flashcardCollection) {
    return <div>Flashcard Collection not found</div>;
  }

  const flashcards = flashcardCollection.flashcards.map((flashcard: any) => ({
    front: flashcard.front,
    back: flashcard.back,
  }));

  return (
    <div className="mx-auto md:w-3/5 px-6 py-10 md:px-0">
      <div className="flex items-center justify-between">
        <div className="flex gap-x-4 items-center">
          <Image
            src={flashcardCollection.user.image || "/default-profile.png"}
            alt="User profile"
            width={1000}
            height={1000}
            className="w-16 h-16 md:w-24 md:h-24 rounded-md cursor-pointer"
          />
          <div>
            <h2 className="font-semibold text-xl">{flashcardCollection.name}</h2>
            <p className="text-gray-500 text-sm py-2">{flashcardCollection.headline}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {flashcardCollection.categories.map((category: any) => (
                <Link
                  href={`/category/${category.name.toLowerCase()}`}
                  key={category.id}
                  className="bg-gray-100 text-gray-600 
                            px-4 py-2 rounded-md
                             cursor-pointer"
                >
                  <h2 className="text-xs text-center">{category.name}</h2>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {flashcardCollection.description && (
        <div className="pt-4">
          <p className="text-gray-500">{flashcardCollection.description}</p>
        </div>
      )}

      <div className="pt-4">
        <CarouselComponent flashcards={flashcards} />
      </div>

      <h2 className="font-semibold text-xl pb-6 pt-10">Community Feedback</h2>

      {flashcardCollection.comments.length > 0 ? (
        <div className="mt-4 space-y-4">
          {flashcardCollection.comments.map((comment: any) => (
            <div key={comment.id} className="border p-4 rounded-lg">
              <div className="flex gap-x-4 items-center">
                <Image
                  src={comment.user.image}
                  alt="profile"
                  width={50}
                  height={50}
                  className="rounded-full h-12 w-12"
                />
                <div>
                  <h2 className="font-semibold">{comment.user.name}</h2>
                  <p className="text-gray-500">{comment.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pt-4">
          <h2 className="text-xl font-semibold">No comments yet</h2>
          <p className="text-gray-500 pt-4">
            Be the first to comment on this collection
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardCollectionPage;
