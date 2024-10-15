import type { Metadata } from 'next';
import './globals.css';
import { FC, ReactNode } from 'react';

type RootLayoutProps = Readonly<{ children: ReactNode }>;

export const metadata: Metadata = {
  title: 'Booking Helper',
  description: 'Always choose the best option for you!',
};

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;
