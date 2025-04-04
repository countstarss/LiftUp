import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { AppProviders } from '@/providers/AppProviders';
import BackToTop from '@/components/BackToTop';
import InitialSessionProvider from './InitialSessionProvider';

export const metadata: Metadata = {
  title: 'LiftUp',
  description: 'A platform to help you pick something joyful to do',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`antialiased bg-gray-100 dark:bg-black flex flex-col min-h-screen`}
      >
        <InitialSessionProvider>
          <AppProviders>
            {children}
            <Toaster position='top-right' />
            <BackToTop />
          </AppProviders>
        </InitialSessionProvider>
      </body>
    </html>
  );
}
