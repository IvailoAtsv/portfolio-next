import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ivaylo Atanassov - Web Developer & Full-Stack Engineer',
    template: '%s | Ivaylo Atanassov',
  },
  description:
    'I am a Web Developer with 3+ years of experience. I specialize in building custom websites, e-commerce platforms, content management systems, and admin dashboards that give you complete control over your business.',
  keywords: [
    'web developer',
    'full-stack developer',
    'React developer',
    'Next.js developer',
    'TypeScript developer',
    'e-commerce developer',
    'CMS developer',
    'admin dashboard developer',
    'frontend developer',
    'backend developer',
    'JavaScript developer',
    'Node.js developer',
    'portfolio',
    'custom websites',
    'web applications',
  ],
  authors: [{ name: 'Ivaylo Atanassov' }],
  creator: 'Ivaylo Atanassov',
  publisher: 'Ivaylo Atanassov',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.ivailo.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ivailo.dev',
    title: 'Ivaylo Atanassov - Web Developer & Full-Stack Engineer',
    description:
      'I am a Web Developer with 3+ years of experience. I specialize in building custom websites, e-commerce platforms, content management systems, and admin dashboards that give you complete control over your business.',
    siteName: 'Ivaylo Atanassov Portfolio',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Ivaylo Atanassov - Web Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ivaylo Atanassov - Web Developer & Full-Stack Engineer',
    description:
      'I am a Web Developer with 3+ years of experience. I specialize in building custom websites, e-commerce platforms, content management systems, and admin dashboards that give you complete control over your business.',
    images: ['/og-image.webp'],
    creator: '@ivayloatanassov',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  classification: 'portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Ivaylo Atanassov',
              jobTitle: 'Web Developer',
              description:
                'Web Developer with 3+ years of experience specializing in custom websites, e-commerce platforms, content management systems, and admin dashboards.',
              url: 'https://www.ivailo.dev',
              sameAs: [
                'https://github.com/ivayloatanassov',
                'https://linkedin.com/in/ivayloatanassov',
              ],
              knowsAbout: [
                'Web Development',
                'React',
                'Next.js',
                'TypeScript',
                'JavaScript',
                'Node.js',
                'E-commerce',
                'Content Management Systems',
                'Admin Dashboards',
              ],
              worksFor: {
                '@type': 'Organization',
                name: 'Freelance',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} dark font-sans antialiased`}
      >
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
