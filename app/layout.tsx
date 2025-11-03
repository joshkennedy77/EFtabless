import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EverFriends - Trinity Health',
  description: 'A friendly AI concierge for wellness and care coordination',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}