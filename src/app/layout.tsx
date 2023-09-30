import './globals.css'
import { ReactNode } from "react";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
      <html lang="en">
          <body>
              <main>
                  {children}
              </main>
          </body>
      </html>
  );
}
