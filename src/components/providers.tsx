"use client" // Penting: Ini harus ada di baris pertama

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  // Kita menggunakan useState agar queryClient tidak terbuat ulang saat render
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>

      {children}
      </SessionProvider>
    </QueryClientProvider>
  )
}