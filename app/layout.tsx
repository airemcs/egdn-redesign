import type { Metadata } from 'next';
import { Lora, Plus_Jakarta_Sans } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const lora = Lora({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-lora',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: 'Elite Group Dental Network',
  description: "Find a trusted dentist near you. Present your ID. That's it.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${lora.variable} ${plusJakartaSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-bg text-text font-body">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
