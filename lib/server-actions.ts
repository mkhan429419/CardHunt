import { auth } from "@/auth";
import { FlashcardData } from "@/types";
import { FlashcardCollection } from "@prisma/client";
import { db } from "./db";

export const createFlashcardCollection = async ({
  id,
  name,
  slug,
  headline,
  description,
  categories,
  flashcards,
}: {
  id:string;
  name: string;
  slug: string;
  headline: string;
  description: string;
  categories: string[];
  flashcards: FlashcardData[];
}): Promise<FlashcardCollection | null> => {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser) {
      throw new Error("You must be signed in to create a flashcard collection");
    }

    const userId = authenticatedUser.user?.id;

    if (!userId) {
      throw new Error("User ID is not available");
    }

    const flashcardCollection = await db.flashcardCollection.create({
      data: {
        id,
        name,
        slug,
        headline,
        description,
        user: {
          connect: {
            id: userId,
          },
        },
        flashcards: {
          create: flashcards.map((flashcard) => ({
            front: flashcard.front,
            back: flashcard.back,
          })),
        },
        categories: {
          connectOrCreate: categories.map((category) => ({
            where: { name: category }, // Adjust based on how categories are stored
            create: { name: category },
          })),
        },
      },
      include: {
        flashcards: true,
        categories: true,
      },
    });

    return flashcardCollection;
  } catch (error) {
    console.error(error);
    return null;
  }
};