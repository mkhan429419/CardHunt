import { auth } from "@/auth";
import Navbar from "@/components/navbar/navbar";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Your App",
};

export default async function PagesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Fetch the authenticated user from the server
  const authenticatedUser = await auth();
  if (!authenticatedUser) {
    redirect("/");
  }
  return (
    <html lang="en">
      <body>
        {/* Passing user data to Navbar */}
        <Navbar initialAuthenticatedUser={authenticatedUser} />
        {children}
      </body>
    </html>
  );
}
