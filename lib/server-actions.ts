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
            where: { name: category },
            create: { name: category },
          })),
        },
      },
      include: {
        flashcards: true,
        categories: true,
        upvotes: true,
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
      upvotes: true,
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
        flashcards: true,
        upvotes: {
          include: {
            user: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
        },
        user: true, // Ensure to include the user details
      },
    });

    return flashcardCollection;
  } catch (error) {
    console.error("Error fetching flashcard collection:", error);
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
      upvotes: {
        select: {
          id: true,
        },
      },
    },
  });

  const maxUpvotes =
    rankedCollections.length > 0
      ? Math.max(
          ...rankedCollections.map((collection) => collection.upvotes.length)
        )
      : 0;

  const collectionsWithRanks = rankedCollections.map((collection, index) => {
    const totalUpvotes = collection.upvotes.length;
    return {
      id: collection.id,
      name: collection.name,
      upvotes: collection.upvotes,
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
        upvotes: true,
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
      flashcardCollection: {
        userId,
      },
    },
  });

  return totalUpvotes;
};

export const getUserTotalComments = async (userId: string) => {
  const totalComments = await db.comment.count({
    where: {
      flashcardCollection: {
        userId,
      },
    },
  });

  return totalComments;
};

export const getAllFlashcardCollections = async () => {
  const flashcardCollections = await db.flashcardCollection.findMany({
    include: {
      categories: true,
      flashcards: true,
      upvotes: {
        include: {
          user: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
      user: true,
    },
    orderBy: {
      upvotes: {
        _count: "desc",
      },
    },
  });

  return flashcardCollections;
};

export const upvoteFlashcardCollection = async (collectionId: string) => {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser?.user?.id) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser.user.id;

    // Check if the user has already upvoted the collection
    const existingUpvote = await db.upvote.findFirst({
      where: {
        flashcardCollectionId: collectionId,
        userId,
      },
    });

    if (existingUpvote) {
      // User has already upvoted, so remove the upvote
      await db.upvote.delete({
        where: { id: existingUpvote.id },
      });
    } else {
      // User has not upvoted yet, so create an upvote
      await db.upvote.create({
        data: {
          flashcardCollectionId: collectionId,
          userId,
        },
      });
    }

    // Return the updated collection data with upvotes and user info
    const updatedCollection = await getFlashcardCollectionById(collectionId);
    return updatedCollection;
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

    await db.comment.create({
      data: {
        flashcardCollectionId: collectionId,
        userId,
        body: commentText,
      },
    });
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

export const getUpvotedFlashcardCollections = async () => {
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

    const upvotedFlashcardCollections = await db.upvote.findMany({
      where: {
        userId,
      },
      include: {
        flashcardCollection: {
          include: {
            user: true,
            categories: true,
            flashcards: true,
            comments: {
              include: {
                user: true,
              },
            },
            upvotes: true,
          },
        },
      },
    });

    return upvotedFlashcardCollections.map(
      (upvote) => upvote.flashcardCollection
    );
  } catch (error) {
    console.error("Error getting upvoted flashcard collections:", error);
    return [];
  }
};

export const getFlashcardCollectionBySlug = async (slug: string) => {
  try {
    const flashcardCollection = await db.flashcardCollection.findUnique({
      where: {
        slug,
      },
      include: {
        categories: true,
        flashcards: true,
        comments: {
          include: {
            user: true,
          },
        },
        upvotes: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });
    return flashcardCollection;
  } catch (error) {
    console.error("Error getting flashcard collection by slug:", error);
    return null;
  }
};

export const getFlashcardCollectionsByUserId = async (userId: string) => {
  try {
    const flashcardCollections = await db.flashcardCollection.findMany({
      where: {
        userId,
      },
      include: {
        categories: true,
        flashcards: true,
        comments: {
          include: {
            user: true,
          },
        },
        upvotes: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });

    return flashcardCollections;
  } catch (error) {
    console.error("Error getting flashcard collections by user ID:", error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const categories = await db.category.findMany({
      include: {
        flashcardCollections: {
          select: {
            id: true,
          },
        },
      },
    });

    // Filtering categories that have at least one associated flashcard collection
    const filteredCategories = categories.filter(
      (category) => category.flashcardCollections.length > 0
    );

    return filteredCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getFlashcardCollectionsByCategoryName = async (
  category: string
) => {
  try {
    const flashcardCollections = await db.flashcardCollection.findMany({
      where: {
        categories: {
          some: {
            name: category,
          },
        },
      },
      include: {
        user: true,
        categories: true,
      },
    });
    return flashcardCollections;
  } catch (error) {
    console.error(
      "Error fetching flashcard collections by category name:",
      error
    );
    return [];
  }
};

export const searchFlashcardCollections = async (query: string) => {
  try {
    const collections = await db.flashcardCollection.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        user: true, // To get the user details such as name and image
      },
    });

    return collections;
  } catch (error) {
    console.error("Error searching flashcard collections:", error);
    return [];
  }
};

export const isUserPremium = async (userId: string) => {
  // Fetch the user from the database based on userId
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.isPremium;
};

export const setUserPremium = async (userId: string) => {
  try {
    await db.user.update({
      where: { id: userId },
      data: { isPremium: true },
    });
  } catch (error) {
    console.error("Error setting user to premium:", error);
    throw new Error("Failed to upgrade membership.");
  }
};

export const getUserRecentActivity = async (userId: string) => {
  try {
    // Fetch recent upvotes on the user's flashcard collections
    const recentUpvotes = await db.upvote.findMany({
      where: {
        flashcardCollection: {
          userId: userId,
        },
      },
      include: {
        flashcardCollection: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5, // Limit the number of recent upvotes
    });

    // Add the type "UPVOTE" to each upvote activity
    const upvoteActivity = recentUpvotes.map((upvote) => ({
      ...upvote,
      type: "UPVOTE",
    }));

    // Fetch recent comments on the user's flashcard collections
    const recentComments = await db.comment.findMany({
      where: {
        flashcardCollection: {
          userId: userId,
        },
      },
      include: {
        flashcardCollection: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5, // Limit the number of recent comments
    });

    // Add the type "COMMENT" to each comment activity
    const commentActivity = recentComments.map((comment) => ({
      ...comment,
      type: "COMMENT",
    }));

    // Combine the recent upvotes and comments into a single array
    const recentActivity = [...upvoteActivity, ...commentActivity].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return recentActivity;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
};
