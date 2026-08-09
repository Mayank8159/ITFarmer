import type { Metadata } from "next";
import { Inter, Space_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ShortcutListener from "@/components/ShortcutListener";
import ScrollProvider from "@/components/ScrollProvider";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import OrbitChat from "@/components/orbit/OrbitChat";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import { CurrencyProvider } from "@/components/CurrencyContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-playfair", // keeping variable name to avoid editing globals.css
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neural Forge Hub | Advanced AI Infrastructure",
  description: "Enterprise-grade GPU compute clusters and autonomous swarm intelligence orchestration for the next generation of AI research.",
  openGraph: {
    title: "Neural Forge Hub",
    description: "Advanced AI Infrastructure Laboratory & Swarm Telemetry",
    url: "https://neuralforge.hub",
    siteName: "Neural Forge Hub",
    images: [
      {
        url: "https://neuralforge.hub/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Neural Forge Hub Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neural Forge Hub",
    description: "Advanced AI Infrastructure Laboratory",
    images: ["https://neuralforge.hub/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceMono.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#e5e5e5] min-h-screen text-black cursor-none`}
      >
        <CurrencyProvider>
          <CustomCursor />
          <LoadingScreen />
          <ScrollProvider>
            <ShortcutListener />
            <Navbar />
            {children}
            <Footer />
            <OrbitChat />
          </ScrollProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}