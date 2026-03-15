import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '../lib/ui/StyledComponentsRegistry';

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Auto Market',
    template: '%s · Auto Market'
  },
  description: 'Auto market catalog with filters, services, VIN tracking and contact forms.',
  openGraph: {
    siteName: 'Auto Market',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={inter.className}>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
