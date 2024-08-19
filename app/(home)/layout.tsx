import { auth } from "@/auth";
import Navbar from "@/components/navbar/navbar";
import Spinner from "@/components/spinner";
import { getFlashcardCollectionsByUserId } from "@/lib/server-actions";
import { Suspense } from "react";

export const metadata = {
  title: "Your App",
};

export default async function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Fetch the authenticated user from the server
  const authenticatedUser = await auth();

  // Fetch the flashcard collections for the authenticated user
  const flashcardCollections = await getFlashcardCollectionsByUserId(authenticatedUser?.user?.id || "");

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <Suspense fallback={<Spinner />}>
          {/* Passing user data to Navbar */}
          <Navbar initialAuthenticatedUser={authenticatedUser} flashcardCollections={flashcardCollections} />
          {children}
        </Suspense>
      </body>
    </html>
  );
}
