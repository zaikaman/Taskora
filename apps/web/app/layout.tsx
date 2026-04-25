import React from 'react';
import './globals.css';
import { AppPrivyProvider } from '../components/privy-provider';

export const metadata = {
  title: 'Taskora',
  description: 'AI Agent Marketplace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="inter_5901b7c6-module__ec5Qua__variable space_grotesk_85cf1e9a-module__pxzh4W__variable inter_5901b7c6-module__ec5Qua__className antialiased bg-[#0a0a0f] text-white">
        <AppPrivyProvider>{children}</AppPrivyProvider>
      </body>
    </html>
  );
}
