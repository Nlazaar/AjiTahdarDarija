import '../globals.css';
import { ToastProvider } from '@/components/ToastContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import ClientLayout from '@/components/ClientLayout';
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import { LanguageProvider } from '@/context/LanguageContext';
import { UserProvider } from '@/context/UserContext';
import { MascotProvider } from '@/contexts/MascotContext';
import { UserProgressProvider } from '@/contexts/UserProgressContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { ThemeProvider } from '@/hooks/useTheme';
import { Amiri, Outfit } from 'next/font/google';

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata = {
  title: 'Darija Maroc',
  description: "Appli d'apprentissage de la darija marocaine",
  applicationName: 'Darija Maroc',
  appleWebApp: {
    capable: true,
    title: 'Darija',
    statusBarStyle: 'black-translucent' as const,
  },
  icons: {
    icon: [
      { url: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/pwa/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/pwa/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover' as const,
  themeColor: '#d4a84b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${outfit.variable} ${amiri.variable}`}>
      <body className="min-h-screen font-outfit" style={{ backgroundColor: 'var(--c-bg)', overflowX: 'hidden' }}>
        <ThemeProvider>
        <AudioProvider>
        <MascotProvider>
          <UserProgressProvider>
            <UserProvider>
              <LanguageProvider>
                <ToastProvider>
                  <ErrorBoundary>
                    <ClientLayout>{children}</ClientLayout>
                    <ServiceWorkerRegister />
                    <InstallPrompt />
                  </ErrorBoundary>
                </ToastProvider>
              </LanguageProvider>
            </UserProvider>
          </UserProgressProvider>
        </MascotProvider>
        </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
