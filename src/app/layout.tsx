import { Providers } from '@/lib/providers';
import { Inter } from 'next/font/google';
import './globals.css';
import { ColorModeScript } from '@chakra-ui/react';
import { theme } from '@/lib/theme';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Aurasense - Voice-First AI',
  description: 'Your voice-first AI lifestyle companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
