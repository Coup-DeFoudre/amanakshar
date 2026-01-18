import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminMobileMenu } from '@/components/admin/AdminMobileMenu'
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <AdminSidebar />
      <AdminMobileMenu />
      <main className="lg:ml-64">
        <AdminBreadcrumb />
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export const metadata = {
  title: 'Admin — अमन अक्षर',
  robots: 'noindex, nofollow',
}

