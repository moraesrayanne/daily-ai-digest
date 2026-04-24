import type { Metadata } from 'next';
import { Instrument_Serif, DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
});

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Daily AI Digest',
  description: 'Os 10 artigos mais relevantes sobre inteligência artificial, curados todo dia às 07:00.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${instrumentSerif.variable} ${dmSans.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
