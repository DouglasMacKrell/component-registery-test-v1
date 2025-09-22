import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Component Registry Showcase',
  description: 'A modern, type-safe component registry system built with Next.js, React, TypeScript, and Builder.io integration. Features Hero, CardList, CTA, SearchBar, and TicketList components.',
  keywords: ['Next.js', 'React', 'TypeScript', 'Component Registry', 'Builder.io', 'UI Components'],
  authors: [{ name: 'Douglas MacKrell' }],
  openGraph: {
    title: 'Component Registry Showcase',
    description: 'A modern, type-safe component registry system with advanced UI components',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Component Registry Showcase',
    description: 'A modern, type-safe component registry system with advanced UI components',
  },
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: '1.6',
        color: '#1f2937',
        backgroundColor: '#f8fafc'
      }}>
        {children}
      </body>
    </html>
  )
}
