import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Log | Neural Forge Hub',
  description: 'Technical write-ups, architecture breakdowns, and system updates from the Neural Forge Hub engineering team.',
  alternates: {
    canonical: '/log',
  },
};

export default function LogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
