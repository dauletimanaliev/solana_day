import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { SolanaProvider } from '@/lib/solana-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'Solana DeFi App - Asset Tokenization',
  description: 'Tokenize real-world assets and enable fractional ownership on Solana',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SolanaProvider>
          {children}
        </SolanaProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
