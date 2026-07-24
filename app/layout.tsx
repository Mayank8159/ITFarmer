import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ShortcutListener from "@/components/ShortcutListener";
import ScrollProvider from "@/components/ScrollProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeuralforgeHub",
  description: "IT Farm Secure Node 01",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} font-sans antialiased bg-gradient-to-b from-[#0a0e27] to-[#020202] min-h-screen text-[#E5E4E2]`}
      >
        <ScrollProvider>
          <ShortcutListener />
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}