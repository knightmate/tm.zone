import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'tym.zone - Share time without timezone drama',
  description: 'Share a link. Everyone sees the time in their own timezone. No signup, no app.',
  metadataBase: new URL('https://tym.zone'),
  openGraph: {
    title: 'tym.zone - Share time without timezone drama',
    description: 'Share a link. Everyone sees the time in their own timezone. No signup, no app.',
    url: 'https://tym.zone',
    siteName: 'tym.zone',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'tym.zone - Share time without timezone drama',
    description: 'Share a link. Everyone sees the time in their own timezone. No signup, no app.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
