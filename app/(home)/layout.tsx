// app/pages/home-layout.tsx
import { auth } from "@/auth";
import Navbar from "@/components/navbar/navbar";

export const metadata = {
  title: "Your App",
};

export default async function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Fetch the authenticated user from the server
  const authenticatedUser = await auth();

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
