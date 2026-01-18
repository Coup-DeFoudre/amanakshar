import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { NotificationForm } from '@/components/admin/NotificationForm'
import { format } from 'date-fns'

export default async function AdminNotificationsPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  const [subscriptions, logs] = await Promise.all([
    db.notificationSubscription.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    db.notificationLog.findMany({
      orderBy: { sentAt: 'desc' },
      take: 20,
    }),
  ])
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-heading text-3xl text-text-primary">
          सूचनाएं
        </h1>
        <p className="font-ui text-text-secondary text-sm mt-2">
          {subscriptions.length} सदस्य सूचनाएं प्राप्त कर रहे हैं
        </p>
      </header>

      <div className="mb-12">
        <NotificationForm />
      </div>

      <section>
        <h2 className="font-heading text-xl text-text-primary mb-4">
          सूचना इतिहास
        </h2>
        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-text-muted font-ui py-8 text-center border border-divider rounded-sm">
              अभी तक कोई सूचना नहीं भेजी गई
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 border border-divider rounded-sm bg-bg-secondary/30"
              >
                <h3 className="font-heading text-text-primary mb-1">
                  {log.title}
                </h3>
                <p className="font-ui text-text-secondary text-sm mb-2">
                  {log.body}
                </p>
                <div className="flex gap-4 font-ui text-xs text-text-muted">
                  <span>
                    {format(new Date(log.sentAt), 'dd MMM yyyy, hh:mm a')}
                  </span>
                  <span>{log.recipientCount} प्राप्तकर्ता</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
