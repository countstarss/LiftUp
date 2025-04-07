import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { AppProviders } from '@/providers/AppProviders';
import BackToTop from '@/components/BackToTop';
import SessionProvider from '../providers/session-provider';
import { BottomBarProvider } from '@/context/bottom-bar-context';
import BottomBar from '@/components/layout/bottom-bar';
import PWAInstallPromptWrapper from '@/components/ui/PWAInstallPromptWrapper';

export const metadata: Metadata = {
  title: 'LiftUp',
  description: 'A platform to help you pick something joyful to do',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LiftUp',
  },
  formatDetection: {
    telephone: false,
  },
  applicationName: 'LiftUp',
  openGraph: {
    type: 'website',
    siteName: 'LiftUp',
    title: 'LiftUp - Pick something joyful to do',
    description: 'A platform to help you pick something joyful to do',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`antialiased bg-gray-100 dark:bg-black flex flex-col min-h-screen`}
      >
        <SessionProvider>
          <AppProviders>
            <BottomBarProvider>
              <div className='flex overflow-y-auto'>
                {children}
                <BottomBar />
                <Toaster position='top-right' />
                <BackToTop />
                <PWAInstallPromptWrapper />
              </div>
            </BottomBarProvider>
          </AppProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
