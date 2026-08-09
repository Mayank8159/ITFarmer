import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Work | Neural Forge Hub',
  description: 'Explore our portfolio of production-ready software, AI integrations, and full-stack web applications.',
  alternates: {
    canonical: '/work',
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
