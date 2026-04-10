import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'tym.zone - Share time without timezone drama',
  description: 'Share your time. Get it back in their timezone. No signup. No tracking.',
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
