import { auth } from "@/auth";
import Navbar from "@/components/navbar/navbar";
import { getFlashcardCollectionsByUserId, isUserPremium } from "@/lib/server-actions";
import { redirect } from "next/navigation";

const NewFlashcardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const authenticatedUser = await auth();

  // Handle case where the user is not authenticated
  if (!authenticatedUser || !authenticatedUser.user) {
    redirect("/");
    return null;
  }

  const userId = authenticatedUser.user.id!;  // Non-null assertion to ensure userId is treated as a string

  // Fetch the user's flashcard collections instead of products
  const flashcardCollections = await getFlashcardCollectionsByUserId(userId);

  // Check if the user is a premium user
  const isPremium = await isUserPremium(userId);

  // Redirect if the user is not premium and already has two flashcard collections
  if (!isPremium && flashcardCollections.length >= 2) {
    redirect("/");
    return null;
  }

  return (
    <html lang="en">
      <body>
        <Navbar
          initialAuthenticatedUser={authenticatedUser}
          flashcardCollections={flashcardCollections}
        />
        {children}
      </body>
    </html>
  );
};

export default NewFlashcardLayout;
