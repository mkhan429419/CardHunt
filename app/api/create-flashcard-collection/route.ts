import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received data:", data);
    const { id, name, slug, headline, description, categories, flashcards } =
      data;

    const authenticatedUser = await auth();

    if (!authenticatedUser) {
      return NextResponse.json(
        { message: "You must be signed in to create a flashcard collection" },
        { status: 401 }
      );
    }

    const userId = authenticatedUser.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is not available" },
        { status: 400 }
      );
    }

    const flashcardCollection = await db.flashcardCollection.create({
      data: {
        id: id || undefined, // Handle the case where `id` might be undefined
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
          create: flashcards.map((flashcard: any) => ({
            front: flashcard.front,
            back: flashcard.back,
          })),
        },
        categories: {
          connectOrCreate: categories.map((category: any) => ({
            where: { name: category },
            create: { name: category },
          })),
        },
      },
      include: {
        flashcards: true,
        categories: true,
      },
    });

    return NextResponse.json(flashcardCollection);
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
