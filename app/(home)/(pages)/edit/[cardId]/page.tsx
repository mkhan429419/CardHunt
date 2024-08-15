import { Badge } from "@/components/ui/badge";
import { getFlashcardCollectionById, getRankById } from "@/lib/server-actions";
import Link from "next/link";
import { PiArrowLeft } from "react-icons/pi";
import Editcard from "./edit-card";
import Deletecard from "./delete-card";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface IParams {
  authenticatedUser: any;
  cardId: string;
}

const CardIDPage = async ({ params }: { params: IParams }) => {
  const card = await getFlashcardCollectionById(params.cardId);

  if (!card) {
    return <div>Card set not found</div>;
  }

  const cardRank = await getRankById();

  // Calculate total comments and upvotes from all flashcards in the collection
  const totalComments = card.flashcards.reduce(
    (acc, flashcard) => acc + flashcard.Comment.length,
    0
  );

  const totalUpvotes = card.flashcards.reduce(
    (acc, flashcard) => acc + flashcard.Upvote.length,
    0
  );

  return (
    <div className="md:w-4/5 mx-auto px-6 md:px-0 py-10">
      <Link href="/my-cards" className="flex gap-x-4">
        <PiArrowLeft className="text-2xl text-gray-500" />
        <p> Go Back</p>
      </Link>

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Editcard card={card} />
          <Deletecard cardId={card.id} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader
            className="flex flex-row items-center 
          justify-between space-y-0 pb-2"
          >
            <CardTitle>Current Rank</CardTitle> 🏅
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {cardRank
                ? cardRank.findIndex((p) => p.id === card.id) + 1
                : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            className="flex flex-row items-center 
          justify-between space-y-0 pb-2"
          >
            <CardTitle>Comments </CardTitle> 💬
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalComments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            className="flex flex-row items-center 
          justify-between space-y-0 pb-2"
          >
            <CardTitle>Upvotes </CardTitle> 🔺
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalUpvotes}</div>
          </CardContent>
        </Card>
      </div>

      <div className="py-6">
        <Separator />
      </div>

      <h2 className="font-semibold text-xl pb-6">Generated Flashcards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {card.flashcards.map((flashcard, index) => (
          <Card key={index} className="border p-4 rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Flashcard {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">Front:</p>
              <p className="text-gray-700">{flashcard.front}</p>
              <Separator className="my-2" />
              <p className="font-medium">Back:</p>
              <p className="text-gray-700">{flashcard.back}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="py-6">
        <Separator />
      </div>

      <h2 className="font-semibold text-xl pb-6">Community Feedback </h2>

      {totalComments > 0 ? (
        <div className="mt-4 space-y-4">
          {card.flashcards.flatMap((flashcard) =>
            flashcard.Comment.map((comment: any) => (
              <div key={comment.id} className="border p-4 rounded-lg">
                <div className="flex gap-x-4 items-center">
                  <Image
                    src={comment.user.image}
                    alt="profile"
                    width={50}
                    height={50}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h2 className="font-semibold">{comment.user.name}</h2>
                    <p className="text-gray-500">{comment.body}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="pt-4">
          <h2 className="text-xl font-semibold">No comments yet</h2>
          <p className="text-gray-500 pt-4">
            Be the first to comment on this card
          </p>
        </div>
      )}
    </div>
  );
};

export default CardIDPage;
