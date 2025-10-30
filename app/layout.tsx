import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SheSync",
  description: "Stay in rhythm, stay in control.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}