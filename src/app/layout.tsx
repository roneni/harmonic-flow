import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/components/auth/auth-provider";
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
  metadataBase: new URL("https://www.harmonyset.com"),
  title: {
    default: "HarmonySet — DJ Playlist Optimizer for Harmonic Mixing",
    template: "%s | HarmonySet",
  },
  description:
    "Mathematically optimize your DJ playlist for perfect harmonic mixing. Upload your Rekordbox, Traktor, or Serato export and get the optimal track order in seconds. Free, private, no account required.",
  keywords: [
    "DJ playlist optimizer",
    "harmonic mixing tool",
    "circle of fifths DJ",
    "Rekordbox playlist order",
    "DJ set planner",
    "key mixing tool",
    "BPM energy flow DJ",
    "Traktor playlist optimizer",
    "Serato harmonic mixing",
    "DJ track order optimizer",
    "harmonic mixing software free",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HarmonySet — DJ Playlist Optimizer for Harmonic Mixing",
    description:
      "Upload your DJ playlist and get the mathematically optimal harmonic order. Works with Rekordbox, Traktor, and Serato.",
    siteName: "HarmonySet",
    url: "https://www.harmonyset.com",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HarmonySet — DJ Playlist Optimizer for Harmonic Mixing",
    description:
      "Upload your DJ playlist and get the mathematically optimal harmonic order in seconds. Free and private.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
