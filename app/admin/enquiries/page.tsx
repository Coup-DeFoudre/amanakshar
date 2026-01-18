import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { format } from 'date-fns'

export default async function AdminEnquiriesPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  const enquiries = await db.contactSubmission.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  const unreadCount = enquiries.filter((e) => !e.isRead).length
  
  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl text-text-primary">
              संपर्क / पूछताछ
            </h1>
            <p className="font-ui text-text-secondary mt-1">
              कुल {enquiries.length} संदेश
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-ui rounded-sm">
              {unreadCount} नए
            </span>
          )}
        </div>
      </header>
      
      <div className="space-y-4">
        {enquiries.length === 0 ? (
          <div className="text-center py-16 border border-divider rounded-sm">
            <p className="font-heading text-2xl text-text-muted mb-4">
              कोई संपर्क नहीं मिला
            </p>
          </div>
        ) : (
          enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className={`p-6 border rounded-sm transition-colors ${
                enquiry.isRead
                  ? 'border-divider bg-bg-secondary/30'
                  : 'border-divider-strong bg-bg-secondary/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-heading text-lg text-text-primary">
                      {enquiry.name}
                    </h3>
                    {!enquiry.isRead && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-ui rounded-sm">
                        नया
                      </span>
                    )}
                    {enquiry.status === 'responded' && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-ui rounded-sm">
                        उत्तर दिया
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 font-ui text-sm text-text-muted mb-3">
                    <a
                      href={`mailto:${enquiry.email}`}
                      className="hover:text-text-primary transition-colors"
                    >
                      📧 {enquiry.email}
                    </a>
                    {enquiry.phone && (
                      <span>📞 {enquiry.phone}</span>
                    )}
                    {enquiry.eventType && (
                      <span>🎭 {enquiry.eventType}</span>
                    )}
                    <span>
                      📅 {format(new Date(enquiry.createdAt), 'dd MMM yyyy, hh:mm a')}
                    </span>
                  </div>
                  <div className="font-ui text-text-secondary whitespace-pre-wrap bg-bg-primary p-4 rounded-sm border border-divider">
                    {enquiry.message}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-divider">
                {!enquiry.isRead && (
                  <form action={async () => {
                    'use server'
                    await db.contactSubmission.update({
                      where: { id: enquiry.id },
                      data: { isRead: true },
                    })
                    redirect('/admin/enquiries')
                  }}>
                    <button
                      type="submit"
                      className="font-ui text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      पढ़ा गया चिह्नित करें
                    </button>
                  </form>
                )}
                {enquiry.status !== 'responded' && (
                  <form action={async () => {
                    'use server'
                    await db.contactSubmission.update({
                      where: { id: enquiry.id },
                      data: { status: 'responded' },
                    })
                    redirect('/admin/enquiries')
                  }}>
                    <button
                      type="submit"
                      className="font-ui text-sm text-green-400 hover:text-green-300 transition-colors"
                    >
                      उत्तर दिया चिह्नित करें
                    </button>
                  </form>
                )}
                <form action={async () => {
                  'use server'
                  await db.contactSubmission.update({
                    where: { id: enquiry.id },
                    data: { status: 'archived' },
                  })
                  redirect('/admin/enquiries')
                }}>
                  <button
                    type="submit"
                    className="font-ui text-sm text-text-muted hover:text-text-secondary transition-colors"
                  >
                    संग्रहित करें
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
