import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // 1. Import your provider
import { BackendProvider, BackendRequired } from "@/context/BackendContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 2. Wrap everything in the AuthProvider */}
        <AuthProvider>
          <BackendProvider>
            <BackendRequired>{children}</BackendRequired>
          </BackendProvider>
        </AuthProvider>
      </body>
    </html>
  );
}