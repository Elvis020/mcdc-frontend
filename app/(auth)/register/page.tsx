'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page with signup tab
    router.replace('/login?tab=signup')
  }, [router])

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">Redirecting to registration...</p>
      </CardContent>
    </Card>
  )
}
