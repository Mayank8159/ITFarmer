import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Estimator | Neural Forge Hub',
  description: 'Deploy advanced AI infrastructure payloads and estimate project parameters for custom neural network training and API integrations.',
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
