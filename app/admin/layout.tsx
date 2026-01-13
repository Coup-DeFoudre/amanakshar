import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Allow access to login page without auth
  // Other admin pages require authentication
  
  return (
    <div className="min-h-screen bg-bg-primary">
      {children}
    </div>
  )
}

export const metadata = {
  title: 'Admin — अमन अक्षर',
  robots: 'noindex, nofollow',
}

