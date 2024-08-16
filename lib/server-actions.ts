"use server";
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
  id: string;
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

export const getOwnerFlashcardCollections = async () => {
  const authenticatedUser = await auth();

  if (!authenticatedUser) {
    return [];
  }

  const userId = authenticatedUser.user?.id;

  const flashcardCollections = await db.flashcardCollection.findMany({
    where: {
      userId,
    },
    include: {
      flashcards: true,
      categories: true,
    },
  });

  return flashcardCollections;
};

export const getFlashcardCollectionById = async (collectionId: string) => {
  try {
    const flashcardCollection = await db.flashcardCollection.findUnique({
      where: {
        id: collectionId,
      },
      include: {
        categories: true,
        flashcards: {
          include: {
            Comment: {
              include: {
                user: true,
              },
            },
            Upvote: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return flashcardCollection;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getRankById = async (): Promise<
  {
    id: string;
    name: string;
    upvotes: { id: string }[];
    rank: number;
  }[]
> => {
  const rankedCollections = await db.flashcardCollection.findMany({
    select: {
      id: true,
      name: true,
      flashcards: {
        select: {
          Upvote: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  // Find the maximum number of upvotes among all collections
  const maxUpvotes =
    rankedCollections.length > 0
      ? rankedCollections[0].flashcards.reduce(
          (acc: number, flashcard) => acc + flashcard.Upvote.length,
          0
        )
      : 0;

  // Assign ranks to each collection based on their number of upvotes
  const collectionsWithRanks = rankedCollections.map((collection, index) => {
    const totalUpvotes = collection.flashcards.reduce(
      (acc: number, flashcard) => acc + flashcard.Upvote.length,
      0
    );
    return {
      id: collection.id,
      name: collection.name,
      upvotes: collection.flashcards.flatMap((flashcard) => flashcard.Upvote),
      rank: totalUpvotes === maxUpvotes ? 1 : index + 2,
    };
  });

  return collectionsWithRanks;
};

export const updateFlashcardCollection = async (
  collectionId: string,
  {
    name,
    slug,
    headline,
    description,
    categories,
  }: {
    name: string;
    slug: string;
    headline: string;
    description: string;
    categories: string[];
  }
): Promise<FlashcardCollection | null> => {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser) {
      throw new Error("You must be signed in to update a flashcard collection");
    }

    const collection = await db.flashcardCollection.findUnique({
      where: {
        id: collectionId,
      },
    });

    if (!collection) {
      throw new Error("Flashcard collection not found");
    }

    const updatedCollection = await db.flashcardCollection.update({
      where: {
        id: collectionId,
      },
      data: {
        name,
        slug,
        headline,
        description,
        categories: {
          set: categories.map((category) => ({ name: category })),
        },
      },
      include: {
        flashcards: true,
        categories: true,
      },
    });

    return updatedCollection;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteFlashcardCollection = async (collectionId: string) => {
  const authenticatedUser = await auth();

  if (
    !authenticatedUser ||
    !authenticatedUser.user ||
    !authenticatedUser.user.id
  ) {
    throw new Error("User ID is missing or invalid");
  }

  const userId = authenticatedUser.user.id;

  const flashcardCollection = await db.flashcardCollection.findUnique({
    where: {
      id: collectionId,
    },
  });

  if (!flashcardCollection) {
    throw new Error("Flashcard collection not found");
  }

  if (flashcardCollection.userId !== userId) {
    throw new Error("Not authorized to delete this flashcard collection");
  }

  await db.flashcardCollection.delete({
    where: {
      id: collectionId,
    },
  });

  return true;
};

export const getUserTotalUpvotes = async (userId: string) => {
  const totalUpvotes = await db.upvote.count({
    where: {
      flashcard: {
        flashcardCollection: {
          userId,
        },
      },
    },
  });

  return totalUpvotes;
};

export const getUserTotalComments = async (userId: string) => {
  const totalComments = await db.comment.count({
    where: {
      flashcard: {
        flashcardCollection: {
          userId,
        },
      },
    },
  });

  return totalComments;
};

export const getUserRecentActivity = async (userId: string) => {
  const recentActivity = await db.notification.findMany({
    where: {
      userId,
    },
    include: {
      user: true,
      flashcard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10, // Limit to recent 10 activities
  });

  return recentActivity;
};

export const getAllFlashcardCollections = async () => {
  const flashcardCollections = await db.flashcardCollection.findMany({
    include: {
      categories: true,
      flashcards: {
        include: {
          Comment: {
            include: {
              user: true,
            },
          },
          Upvote: {
            include: {
              user: true,
            },
          },
        },
      },
      user: true, // Ensure the user relation is included here
    },
    orderBy: {
      flashcards: {
        _count: "desc",
      },
    },
  });

  return flashcardCollections;
};

export const upvoteFlashcardCollection = async (collectionId: string) => {
  try {
    const authenticatedUser = await auth();

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser.user.id;

    const upvote = await db.upvote.findFirst({
      where: {
        flashcardId: collectionId,
        userId,
      },
    });

    const profilePicture = authenticatedUser.user.image || ""; // Use an empty string if profile picture is undefined

    if (upvote) {
      await db.upvote.delete({
        where: {
          id: upvote.id,
        },
      });
    } else {
      await db.upvote.create({
        data: {
          flashcardId: collectionId,
          userId,
        },
      });

      const collectionOwner = await db.flashcardCollection.findUnique({
        where: {
          id: collectionId,
        },
        select: {
          userId: true,
        },
      });

      // notify the flashcard collection owner about the upvote

      if (collectionOwner && collectionOwner.userId !== userId) {
        await db.notification.create({
          data: {
            userId: collectionOwner.userId,
            body: `Upvoted your flashcard collection`,
            profilePicture: profilePicture,
            flashcardId: collectionId,
            type: "UPVOTE",
            status: "UNREAD",
          },
        });
      }
    }
    return true;
  } catch (error) {
    console.error("Error upvoting flashcard collection:", error);
    throw error;
  }
};

export const commentOnFlashcardCollection = async (
  collectionId: string,
  commentText: string
) => {
  try {
    const authenticatedUser = await auth();

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser.user.id;

    // Check if authenticated user has a profile picture
    const profilePicture = authenticatedUser.user.image || ""; // Use an empty string if profile picture is undefined

    await db.comment.create({
      data: {
        createdAt: new Date(),
        flashcardId: collectionId,
        userId,
        body: commentText,
        profilePicture: profilePicture,
      },
      include: {
        user: true,
      },
    });

    const collectionDetails = await db.flashcardCollection.findUnique({
      where: {
        id: collectionId,
      },
      select: {
        userId: true,
        name: true, // Include the collection name in the query
      },
    });

    // Check if the commenter is not the owner of the flashcard collection
    if (collectionDetails && collectionDetails.userId !== userId) {
      // Notify the collection owner about the comment
      await db.notification.create({
        data: {
          userId: collectionDetails.userId,
          body: `Commented on your flashcard collection "${collectionDetails.name}"`,
          profilePicture: profilePicture,
          flashcardId: collectionId,
          type: "COMMENT",
          status: "UNREAD",
        },
      });
    }
  } catch (error) {
    console.error("Error commenting on flashcard collection:", error);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    await db.comment.delete({
      where: {
        id: commentId,
      },
    });
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
