import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Outfit, Inter } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'),
  title: {
    default: 'Be Independent Gal (BIG) | Women\'s Community & Growth Platform',
    template: '%s | BIG',
  },
  description:
    'Be Independent Gal (BIG) is a women\'s growth movement helping women build independent, purpose-driven lives through community, mentorship, and opportunity.',
  keywords: [
    'women community',
    'women entrepreneurship',
    'mentorship',
    'networking',
    'professional development',
    'women empowerment',
    'growth community',
  ],
  authors: [
    {
      name: 'Be Independent Gal',
      url: 'https://big.org',
    },
  ],
  creator: 'Be Independent Gal',
  publisher: 'Be Independent Gal',
  generator: 'Next.js',
  applicationName: 'Be Independent Gal',
  referrer: 'strict-origin-when-cross-origin',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://big.org',
    siteName: 'Be Independent Gal',
    title: 'Be Independent Gal (BIG) | Women\'s Community & Growth Platform',
    description:
      'Join thousands of women building independent, purpose-driven lives through community, mentorship, and opportunity.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Be Independent Gal Community',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Be Independent Gal (BIG)',
    description: 'Women\'s community for learning, connecting, earning, and thriving',
    creator: '@BIG',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://big.org',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#D6006D',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BIG" />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className={`${outfit.variable} ${inter.variable} font-inter antialiased bg-white text-gray-900`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <SiteHeader />

            {/* Main content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <SiteFooter />
          </div>
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  )
}
