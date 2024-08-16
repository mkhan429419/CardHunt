"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  PiArrowBendDoubleUpRight,
  PiCaretUpFill,
  PiChatCircle,
} from "react-icons/pi";
import FlashcardCollectionModal from "./ui/modals/flashcard-collection-modal";
import FlashcardCollectionModalContent from "./flashcard-collection-modal-content";
import Modal from "./ui/modals/modal";
import AuthContent from "./navbar/auth-content";
import { upvoteFlashcardCollection } from "@/lib/server-actions";
import { motion } from "framer-motion";
import Link from "next/link";
import LogoSmall from "@/public/logo/logo-small.png";
import { getFlashcardCollectionById } from "@/lib/server-actions";

interface FlashcardCollectionItemProps {
  collection: any;
  authenticatedUser: any;
}

const FlashcardCollectionItem: React.FC<FlashcardCollectionItemProps> = ({
  collection,
  authenticatedUser,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<any>(null);

  const [hasUpvoted, setHasUpvoted] = useState(
    collection.upvoters?.includes(authenticatedUser?.user.id)
  );

  const [totalUpvotes, setTotalUpvotes] = useState(collection.upvotes || 0);
  const [totalComments, setTotalComments] = useState(
    collection.commentsLength || 0
  );

  useEffect(() => {
    setHasUpvoted(collection.upvoters?.includes(authenticatedUser?.user.id));
    setTotalUpvotes(collection.upvotes);
    setTotalComments(collection.commentsLength);
  }, [
    collection.upvoters,
    collection.upvotes,
    collection.commentsLength,
    authenticatedUser,
  ]);

  const handleCollectionItemClick = async () => {
    if (!authenticatedUser) {
      setShowLoginModal(true);
    } else {
      try {
        const updatedCollection = await getFlashcardCollectionById(
          collection.id
        ); // Fetch latest data
        setCurrentCollection(updatedCollection);
        setShowCollectionModal(true);
      } catch (error) {
        console.error("Error fetching flashcard collection:", error);
      }
    }
  };

  const handleArrowClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    window.open(`/flashcards/${collection.slug}`, "_blank");
  };

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation();
  };

  const handleUpvoteClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();

    try {
      const updatedCollection = await upvoteFlashcardCollection(collection.id);
      if (updatedCollection) {
        setHasUpvoted(
          updatedCollection.upvotes.some(
            (upvote) => upvote.userId === authenticatedUser.user.id
          )
        );
        setTotalUpvotes(updatedCollection.upvotes.length);
        setTotalComments(updatedCollection.comments.length);
      }
    } catch (error) {
      console.error("Error upvoting flashcard collection:", error);
    }
  };

  const variants = {
    initial: { scale: 1 },
    upvoted: { scale: [1, 1.2, 1], transition: { duration: 0.3 } },
  };

  return (
    <div
      onClick={handleCollectionItemClick}
      className="
        py-4 w-full cursor-pointer p-2   
        rounded-md
        hover:bg-gradient-to-bl
        from-[#ffe6d3]
        via-[#fdfdfd]
        to-white
      "
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={collection.user?.image || LogoSmall}
            alt="User profile"
            width={1000}
            height={1000}
            className="h-12 w-12 rounded-full"
          />

          <div className="ml-4">
            <div className="md:flex items-center gap-x-2">
              <h1 className="text-sm font-semibold">{collection.name}</h1>
              <p className="hidden md:flex text-xs">-</p>
              <p className="text-gray-500 text-xs md:text-sm pr-2">
                {collection.headline}
              </p>
              <div
                onClick={handleArrowClick}
                className="hidden md:flex cursor-pointer"
              >
                <PiArrowBendDoubleUpRight />
              </div>
            </div>
            <div className="hidden md:flex gap-x-2 items-center">
              <div className="text-xs text-gray-500 flex gap-x-1 items-center">
                {collection.commentsLength}
                <PiChatCircle />
              </div>

              {collection.categories.map((category: string) => (
                <div key={category} className="text-xs text-gray-500">
                  <div className="flex gap-x-1 items-center">
                    <div className="mr-1">•</div>
                    <Link
                      href={`/category/${category.toLowerCase()}`}
                      className="hover:underline"
                      onClick={handleCategoryClick}
                    >
                      {category}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm">
          <motion.div
            onClick={handleUpvoteClick}
            variants={variants}
            animate={hasUpvoted ? "upvoted" : "initial"}
          >
            {hasUpvoted ? (
              <div
                className="border px-2 rounded-md flex flex-col 
                items-center bg-gradient-to-bl 
                from-[#ff6154] to-[#ff4582] border-[#ff6154]
                text-white"
              >
                <PiCaretUpFill className="text-xl" />
                {totalUpvotes}
              </div>
            ) : (
              <div className="border px-2 rounded-md flex flex-col items-center">
                <PiCaretUpFill className="text-xl" />
                {totalUpvotes}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <FlashcardCollectionModal
        visible={showCollectionModal}
        setVisible={setShowCollectionModal}
      >
        <FlashcardCollectionModalContent
          currentCollection={currentCollection}
          authenticatedUser={authenticatedUser}
          setTotalUpvotes={setTotalUpvotes}
          totalUpvotes={totalUpvotes}
          hasUpvoted={hasUpvoted}
          setHasUpvoted={setHasUpvoted}
        />
      </FlashcardCollectionModal>

      <Modal visible={showLoginModal} setVisible={setShowLoginModal}>
        <AuthContent />
      </Modal>
    </div>
  );
};

export default FlashcardCollectionItem;
