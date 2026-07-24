"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ShortcutListener() {
  const router = useRouter();
  const bufferRef = useRef<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Prevent browser defaults for Ctrl+U (view source) or Ctrl+Y (redo) so shortcut isn't interrupted
      if (e.ctrlKey && ['q', 'y', 'u'].includes(key)) {
        e.preventDefault();
      }

      // We only care about q, y, u, and backspace
      if (['q', 'y', 'u', 'backspace'].includes(key)) {
        bufferRef.current.push(key);
        // Keep buffer size to 4
        if (bufferRef.current.length > 4) {
          bufferRef.current.shift();
        }

        if (key === 'backspace' && e.ctrlKey) {
          // Check if the first 3 keys in the buffer are exactly q, y, u in any order
          if (bufferRef.current.length === 4) {
            const firstThree = bufferRef.current.slice(0, 3);
            const hasQ = firstThree.includes('q');
            const hasY = firstThree.includes('y');
            const hasU = firstThree.includes('u');

            if (hasQ && hasY && hasU) {
              e.preventDefault(); // Prevent browser back action
              bufferRef.current = []; // Reset buffer
              router.push('/admin');
            }
          }
        }
      } else if (key !== 'control') {
        // If they press any other key (except control), reset the buffer
        bufferRef.current = [];
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null; // This component doesn't render anything
}
