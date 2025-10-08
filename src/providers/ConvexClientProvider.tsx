'use client'

import { ReactNode } from 'react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { CONVEX_URL, isConvexConfigured } from '@/lib/convex-config'

const convex = isConvexConfigured ? new ConvexReactClient(CONVEX_URL!) : null

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'NEXT_PUBLIC_CONVEX_URL is not set. Convex-backed features are disabled.'
      )
    }

    return <>{children}</>
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
