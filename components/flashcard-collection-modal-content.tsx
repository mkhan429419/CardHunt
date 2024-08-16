"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PiCaretUpFill,
  PiChatCircle,
  PiTrash,
  PiUploadSimple,
} from "react-icons/pi";
import CarouselComponent from "./carousel-component";
import { useEffect, useState } from "react";
import ShareModal from "./ui/modals/share-product-modal";
import ShareModalContent from "./share-modal-content";
import {
  commentOnFlashcardCollection,
  deleteComment,
  upvoteFlashcardCollection,
} from "@/lib/server-actions";
import { Badge } from "./ui/badge";
import { getFlashcardCollectionById } from "@/lib/server-actions";

interface FlashcardCollectionModalContentProps {
  currentCollection: any;
  authenticatedUser: any;
  totalUpvotes: number;
  hasUpvoted: boolean;
  setTotalUpvotes: any;
  setHasUpvoted: any;
}

const FlashcardCollectionModalContent: React.FC<
  FlashcardCollectionModalContentProps
> = ({
  currentCollection,
  authenticatedUser,
  totalUpvotes,
  hasUpvoted,
  setTotalUpvotes,
  setHasUpvoted,
}) => {
  const [commentText, setCommentText] = useState("");
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [comments, setComments] = useState(currentCollection.comments || []);

  useEffect(() => {
    if (currentCollection) {
      // Set initial upvote state based on the fetched collection data
      setTotalUpvotes(currentCollection.upvotes.length);
      setHasUpvoted(
        currentCollection.upvotes.some(
          (upvote: { userId: any; }) => upvote.userId === authenticatedUser.user.id
        )
      );
    }
  }, [currentCollection, authenticatedUser, setTotalUpvotes, setHasUpvoted]);

  const handleShareClick = () => {
    setShareModalVisible(true);
  };

  const handleCommentSubmit = async () => {
    try {
      await commentOnFlashcardCollection(currentCollection.id, commentText);
      setCommentText("");
      const updatedCollection = await getFlashcardCollectionById(
        currentCollection.id
      );

      if (updatedCollection) {
        // Null check to ensure updatedCollection is not null
        setComments(updatedCollection.comments);
      } else {
        console.error("Failed to fetch the updated collection data.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentChange = (event: any) => {
    setCommentText(event.target.value);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment: any) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleUpvoteClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
  
    try {
      const updatedCollection = await upvoteFlashcardCollection(currentCollection.id);
  
      if (updatedCollection) {
        setTotalUpvotes(updatedCollection.upvotes.length);
        setHasUpvoted(
          updatedCollection.upvotes.some(
            (upvote) => upvote.userId === authenticatedUser.user.id
          )
        );
      } else {
        console.error("Failed to fetch the updated collection data.");
      }
    } catch (error) {
      console.error("Error upvoting flashcard collection:", error);
    }
  };
  

  return (
    <div className="h-full">
      <div className="md:w-4/5 mx-auto">
        <Image
          src={currentCollection.user?.image || "/default-profile.png"}
          alt="User profile"
          width={200}
          height={200}
          className="h-20 w-20 border rounded-full bg-white shadow-md"
        />

        <div className="py-4 space-y-2">
          <h1 className="text-2xl font-semibold">{currentCollection.name}</h1>
          <div className="md:flex md:justify-between items-center">
            <p className="text-gray-600 text-xl font-light md:w-3/5">
              {currentCollection.headline}
            </p>

            <div className="flex items-center gap-2 pt-4">
              <button
                className={`rounded-md flex justify-center items-center p-5 
                gap-x-3 cursor-pointer bg-gradient-to-r w-full xl:w-56 ${
                  hasUpvoted
                    ? "from-[#ff6154] to-[#ff4582] border-[#ff6154] text-white"
                    : "text-black border"
                }`}
                onClick={handleUpvoteClick}
              >
                <PiCaretUpFill
                  className={`text-xl ${
                    hasUpvoted ? "text-white" : "text-black"
                  }`}
                />
                {totalUpvotes}
              </button>
            </div>
          </div>
          <h2 className="text-gray-600 py-6">
            {currentCollection.description}
          </h2>

          <div className="md:flex justify-between items-center">
            <div className="flex gap-x-2">
              {currentCollection.categories.map((category: any) => (
                <Link
                  href={`/category/${category.name.toLowerCase()}`} // Access the `name` property
                  key={category.id} // Use `id` as the key to ensure uniqueness
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md cursor-pointer"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-x-4 py-4">
              <div
                className="text-md text-gray-600 
              flex items-center gap-x-1 cursor-pointer"
              >
                <PiChatCircle />
                <p>Discuss</p>
              </div>

              <div
                onClick={handleShareClick}
                className="text-md text-gray-600 
              flex items-center gap-x-1 cursor-pointer"
              >
                <PiUploadSimple />
                <p>Share</p>
              </div>
            </div>
          </div>

          <CarouselComponent flashcards={currentCollection.flashcards} />

          <h1 className="font-semibold pt-10">Community Feedback</h1>

          <div>
            <div className="w-full flex gap-4 mt-4">
              <Image
                src={authenticatedUser.user.image}
                alt="profile"
                width={50}
                height={50}
                className="rounded-full h-12 w-12"
              />

              <textarea
                value={commentText}
                onChange={handleCommentChange}
                placeholder="What do you think about this collection?"
                className="w-full rounded-md p-4 
                focus:outline-none text-gray-600"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleCommentSubmit}
                className="bg-[#ff6154] text-white p-2 rounded-md"
              >
                Comment
              </button>
            </div>
          </div>

          <div className="py-8 space-y-8">
            {comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-4">
                <Image
                  src={comment.profilePicture}
                  alt="profile"
                  width={50}
                  height={50}
                  className="w-8 h-8 rounded-full mt-1 cursor-pointer"
                />

                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-2 items-center">
                      <h1 className="text-gray-600 font-semibold cursor-pointer">
                        {comment.user.name}
                      </h1>
                      {comment.userId === currentCollection.userId && (
                        <Badge className="bg-[#88aaff]">Creator</Badge>
                      )}

                      <div className="text-gray-500 text-xs">
                        {new Date(comment.createdAt).toDateString()}
                      </div>
                    </div>

                    {(comment.userId === authenticatedUser?.user?.id ||
                      currentCollection.userId ===
                        authenticatedUser?.user?.id) && (
                      <PiTrash
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:cursor-pointer"
                      />
                    )}
                  </div>

                  <div
                    className="text-gray-600 text-sm 
                    hover:cursor-pointer mt-2"
                  >
                    {comment.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ShareModal visible={shareModalVisible} setVisible={setShareModalVisible}>
        <ShareModalContent currentCollection={currentCollection} />
      </ShareModal>
    </div>
  );
};

export default FlashcardCollectionModalContent;
