import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { AppProviders } from '@/providers/AppProviders';
import BackToTop from '@/components/BackToTop';
import SessionProvider from '../providers/session-provider';
import BottomBar from '@/components/layout/bottom-bar';

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
        <SessionProvider>
          <AppProviders>
          <div className='flex overflow-y-auto'>
            <BottomBar />
            {children}
            <Toaster position='top-right' />
            <BackToTop />
          </div>
          </AppProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
