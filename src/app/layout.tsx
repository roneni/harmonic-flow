import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Harmonic Flow — DJ Playlist Optimizer",
    template: "%s | Harmonic Flow",
  },
  description:
    "Mathematically optimize your DJ playlist for perfect harmonic mixing. Works with Rekordbox, Traktor, and Serato exports.",
  openGraph: {
    title: "Harmonic Flow — DJ Playlist Optimizer",
    description:
      "Mathematically optimize your DJ playlist for perfect harmonic mixing.",
    siteName: "Harmonic Flow",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-text-primary`}
      >
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
      </body>
    </html>
  );
}
