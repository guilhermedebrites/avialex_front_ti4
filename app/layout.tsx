import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/lib/components/theme-provider'
import { AuthProvider } from '@/lib/contexts'
import { Toaster } from '@/lib/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'Avialex - Sistema de Gestão',
  description: 'Sistema de gestão para processos de imigração',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider apiBaseURL={process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com'}>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
