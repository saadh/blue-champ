import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blue Champ - Quiz Tournament Platform",
  description: "Educational Multiplayer Quiz Gaming Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
