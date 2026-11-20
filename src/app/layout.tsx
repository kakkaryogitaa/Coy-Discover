
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coy Discover | Find Your Connection",
  description:
    "Discover new people, explore interests and find mutual connections."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
