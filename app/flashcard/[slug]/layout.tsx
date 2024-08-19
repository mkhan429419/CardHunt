import { auth } from "@/auth";
import Navbar from "@/components/navbar/navbar";
import { getFlashcardCollectionsByUserId } from "@/lib/server-actions";

const FlashcardCollectionPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const authenticatedUser = await auth();

  const flashcardCollections = await getFlashcardCollectionsByUserId(
    authenticatedUser?.user?.id || ""
  );

  return (
    <html lang="en">
      <body>
        <Navbar initialAuthenticatedUser={authenticatedUser} flashcardCollections={flashcardCollections} />
        {children}
      </body>
    </html>
  );
};

export default FlashcardCollectionPageLayout;
