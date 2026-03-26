import '../globals.css';
import { ToastProvider } from '@/components/ToastContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import ClientLayout from '@/components/ClientLayout';
import { LanguageProvider } from '@/context/LanguageContext';
import { UserProvider } from '@/context/UserContext';
import { MascotProvider } from '@/contexts/MascotContext';
import { UserProgressProvider } from '@/contexts/UserProgressContext';
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${outfit.variable} ${amiri.variable}`}>
      <body className="min-h-screen font-outfit" style={{ backgroundColor: '#131f24', overflowX: 'hidden' }}>
        <MascotProvider>
          <UserProgressProvider>
            <UserProvider>
              <LanguageProvider>
                <ToastProvider>
                  <ErrorBoundary>
                    <ClientLayout>{children}</ClientLayout>
                  </ErrorBoundary>
                </ToastProvider>
              </LanguageProvider>
            </UserProvider>
          </UserProgressProvider>
        </MascotProvider>
      </body>
    </html>
  );
}
