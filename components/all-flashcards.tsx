import { auth } from "@/auth";
import FlashcardCollectionItem from "./flashcard-collection-item";

interface AllFlashcardsProps {
  flashcardCollections: any;
}

const AllFlashcards: React.FC<AllFlashcardsProps> = async ({
  flashcardCollections,
}) => {
  const authenticatedUser = await auth();

  const formattedFlashcardCollections = flashcardCollections?.map(
    (collection: any) => {
      const {
        id,
        name,
        slug,
        headline,
        description,
        createdAt,
        updatedAt,
        userId,
        flashcards,
        categories,
        comments, // Make sure comments are being accessed correctly
        upvotes,
        user,
      } = collection;

      const commentText = comments
        ? comments.map((comment: any) => ({
            id: comment.id,
            profile: comment.profilePicture,
            body: comment.body,
            user: comment.user.name,
            timestamp: comment.createdAt,
            userId: comment.user.id,
            name: comment.user.name.toLowerCase().replace(/\s/g, "_"),
          }))
        : [];

      const upvotesCount = upvotes ? upvotes.length : 0;
      const upvoters = upvotes
        ? upvotes.map((upvote: any) => upvote.user.id)
        : [];

      return {
        id,
        name,
        slug,
        headline,
        description,
        createdAt,
        updatedAt,
        userId,
        flashcards,
        categories: categories.map((category: any) => category.name),
        commentsLength: comments.length, // Ensure commentsLength is set correctly
        commentData: commentText,
        upvoters,
        upvotes: upvotesCount,
        user,
      };
    }
  );

  return (
    <div className="w-full">
      <div className="flex items-center border-b pb-3">
        <h1 className="text-xl font-medium">All Flashcard Collections</h1>
      </div>

      <div className="space-y-2 py-6 flex flex-col">
        {formattedFlashcardCollections?.map((collection: any) => (
          <FlashcardCollectionItem
            key={collection.id}
            collection={collection}
            authenticatedUser={authenticatedUser}
          />
        ))}
      </div>
    </div>
  );
};

export default AllFlashcards;
