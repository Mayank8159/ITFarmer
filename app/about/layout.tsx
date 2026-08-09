import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Neural Forge Hub',
  description: 'Meet the engineering team behind Neural Forge Hub. We build robust, scalable AI and software systems for modern businesses.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
