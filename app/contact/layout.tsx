import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Strategy Call | Neural Forge Hub',
  description: 'Discuss your architecture, technical constraints, and engineering requirements directly with a core engineer.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
