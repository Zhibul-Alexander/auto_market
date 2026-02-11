import type { Metadata } from 'next';
import StyledComponentsRegistry from '../lib/ui/StyledComponentsRegistry';

export const metadata: Metadata = {
  title: {
    default: 'Auto Market',
    template: '%s · Auto Market'
  },
  description: 'Auto market catalog with filters, services, VIN tracking and contact forms.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
