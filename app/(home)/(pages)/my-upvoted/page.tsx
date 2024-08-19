import { auth } from "@/auth";
import { getUpvotedFlashcardCollections } from "@/lib/server-actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const MyUpvotedFlashcardCollections = async () => {
  const authenticatedUser = await auth();

  if (!authenticatedUser) {
    redirect("/");
  }

  const flashcardCollections = await getUpvotedFlashcardCollections();

  return (
    <div className="mx-auto md:w-3/5 pt-10 px-6 md:px-0">
      {flashcardCollections.length === 0 ? (
        <div>
          <h1 className="text-3xl font-bold">
            You have not upvoted any collections yet
          </h1>
          <p className="text-gray-500 pt-4">
            Upvote collections to get started, and they will display here
          </p>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold">Your Upvotes</h1>
            <p className="text-gray-500">
              View all the collections you have upvoted
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {flashcardCollections.map((collection: any) => (
              <Link href={`/flashcard/${collection.slug}`} key={collection.id}>
                <div>
                  <div
                    className="
                      rounded-lg 
                      hover:scale-105 
                      transition-transform
                      duration-300
                      ease-in-out
                      justify-center
                      items-center
                      border
                    "
                  >
                    <Image
                      src={collection.user.image || "/default-profile.png"}
                      alt="User profile"
                      width={1000}
                      height={1000}
                      className="rounded-t-lg object-cover h-40"
                    />

                    <h2 className="font-semibold text-lg p-4">
                      {collection.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyUpvotedFlashcardCollections;
