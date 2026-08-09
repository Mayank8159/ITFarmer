import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Neural Forge Hub',
  description: 'Learn about the cutting-edge autonomous agents and massive GPU compute clusters powering the Neural Forge Hub ecosystem.',
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
