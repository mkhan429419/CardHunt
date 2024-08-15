"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { FlashcardCollection, FlashcardData } from "@/types";


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

export const createFlashcardCollection = async ({
  name,
  slug,
  headline,
  description,
  flashcards, // Array of flashcards
  category,
}: FlashcardCollection): Promise<any> => {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser) {
      throw new Error("You must be signed in to create a flashcard collection");
    }

    const userId = authenticatedUser.user?.id;

    const flashcardCollection = await db.flashcardCollection.create({
      data: {
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
            name: flashcard.name,
            slug: flashcard.slug,
            headline: flashcard.headline,
            description: flashcard.description,
            front: flashcard.front,
            back: flashcard.back,
          })),
        },
        categories: {
          connectOrCreate: category.map((name:string) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });

    return flashcardCollection;
  } catch (error) {
    console.error(error);
    return null;
  }
};
