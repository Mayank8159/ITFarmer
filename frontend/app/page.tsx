import FloatingNavbar from "@/components/Navbar";
import { JSX } from "react";

export default function HomePage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-zinc-100">
      {/* Floating Navbar */}
      <FloatingNavbar />

      {/* Page Content */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
          Building delightful digital experiences
        </h1>

        <p className="mt-4 max-w-xl text-base text-zinc-600 md:text-lg">
          A playground for ideas, experiments, and thoughtful design systems.
        </p>
      </section>
    </main>
  );
}
