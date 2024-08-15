// "use server";

// import { auth } from "@/auth";
// import { db } from "@/lib/db";
// import { FlashcardData } from "@/types";

// export const createFlashcard = async ({
//   front,
//   back,
//   flashcardCollectionId,
// }: FlashcardData): Promise<any> => {
//   try {
//     const authenticatedUser = await auth();

//     if (!authenticatedUser) {
//       throw new Error("You must be signed in to create a flashcard");
//     }

//     const userId = authenticatedUser.user?.id;

//     const flashcard = await db.flashcard.create({
//       data: {
//         front,
//         back,
//         flashcardCollection: {
//           connect: {
//             id: flashcardCollectionId,
//           },
//         },
//         user: {
//           connect: {
//             id: userId,
//           },
//         },
//       },
//     });

//     return flashcard;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };
