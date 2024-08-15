const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const userId = "clzvetp2t000czka5too8bh15";

  // Helper function to find or create a category
  async function findOrCreateCategory(name) {
    let category = await prisma.category.findUnique({
      where: { name },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { name },
      });
    }
    return category;
  }

  // Create or find categories
  const category1 = await findOrCreateCategory("Category 1");
  const category2 = await findOrCreateCategory("Category 2");

  // Create flashcard collections
  const flashcardCollection1 = await prisma.flashcardCollection.create({
    data: {
      name: "Collection 1",
      slug: "collection-1",
      headline: "First collection",
      description: "This is the first collection",
      userId: userId,
      categories: {
        connect: [{ id: category1.id }, { id: category2.id }],
      },
      flashcards: {
        create: [
          {
            front: "Flashcard 1 Front",
            back: "Flashcard 1 Back",
            Comment: {
              create: [
                {
                  profilePicture: "http://example.com/pic1.jpg",
                  body: "Great flashcard!",
                  userId: userId,
                },
              ],
            },
            Upvote: {
              create: [
                {
                  userId: userId,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const flashcardCollection2 = await prisma.flashcardCollection.create({
    data: {
      name: "Collection 2",
      slug: "collection-2",
      headline: "Second collection",
      description: "This is the second collection",
      userId: userId,
      categories: {
        connect: [{ id: category1.id }],
      },
      flashcards: {
        create: [
          {
            front: "Flashcard 2 Front",
            back: "Flashcard 2 Back",
            Comment: {
              create: [
                {
                  profilePicture: "http://example.com/pic2.jpg",
                  body: "Nice flashcard!",
                  userId: userId,
                },
              ],
            },
            Upvote: {
              create: [
                {
                  userId: userId,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log({ flashcardCollection1, flashcardCollection2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
