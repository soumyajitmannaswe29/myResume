import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Syne } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })

export const metadata: Metadata = {
  title: 'Soumyajit Manna — AI/ML Engineer & Full-Stack Java Developer',
  description:
    'Portfolio of Soumyajit Manna, CSE undergraduate at IEM Kolkata building CNN-powered deep learning systems and full-stack Java applications.',
  generator: 'v0.app',
  keywords: ['Soumyajit Manna', 'AI/ML Engineer', 'Deep Learning', 'CNN', 'Java DSA', 'IEM Kolkata', 'Portfolio'],
  openGraph: {
    title: 'Soumyajit Manna — AI/ML Engineer',
    description: 'Crafting intelligent systems from neural networks to full-stack architectures.',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#090D16',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} ${jetbrains.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
