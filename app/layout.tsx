import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Card Hunt",
  description: "An ai-generated flashcard sharing application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
      {children}
      <Toaster/>
      </body>
    </html>
  );
}
