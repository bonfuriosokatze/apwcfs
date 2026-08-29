import type { Metadata } from 'next';
import Navbar from '@/components/navigation/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'APWCFS - Air Pollution Weather Coupled Forecasting System',
  description: 'Delhi NCR 72-hour air quality forecasting with explainable AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
