"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

interface FlashcardData {
  name: string;
  slug: string;
  headline: string;
  description: string;
  front: string; // Added front content of the flashcard
  back: string; // Added back content of the flashcard
  category: string[];
  rank?: number;
}

export const createFlashcard = async ({
  name,
  slug,
  headline,
  description,
  front,
  back,
  category, rank = 0
}: FlashcardData): Promise<any> => {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser) {
      throw new Error("You must be signed in to create a flashcard");
    }

    const userId = authenticatedUser.user?.id;

    const flashcard = await db.flashcard.create({
      data: {
        name,
        slug,
        headline,
        description,
        front, // Save the front content
        back, // Save the back content
        rank: rank || 0, // Default rank to 0 if not provided
        categories: {
          connectOrCreate: category.map((name) => ({
            where: {
              name,
            },
            create: {
              name,
            },
          })),
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return flashcard;
  } catch (error) {
    console.error(error);
    return null;
  }
};
