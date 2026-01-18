import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { StatsCard } from '@/components/admin/StatsCard'
import { RecentActivity } from '@/components/admin/RecentActivity'

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  // Get statistics
  const [
    totalPoems,
    publishedPoems,
    totalEvents,
    upcomingEvents,
    totalEnquiries,
    unreadEnquiries,
    totalPerformances,
    totalBooks,
  ] = await Promise.all([
    db.poem.count(),
    db.poem.count({ where: { isPublished: true } }),
    db.event.count(),
    db.event.count({
      where: {
        isPublished: true,
        eventDate: { gte: new Date() },
      },
    }),
    db.contactSubmission.count(),
    db.contactSubmission.count({ where: { isRead: false } }),
    db.performance.count({ where: { isPublished: true } }),
    db.book.count({ where: { isPublished: true } }),
  ])

  // Get recent activity
  const [recentPoems, recentEvents, recentEnquiries] = await Promise.all([
    db.poem.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, createdAt: true },
    }),
    db.event.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, createdAt: true },
    }),
    db.contactSubmission.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, createdAt: true },
    }),
  ])

  const recentItems = [
    ...recentPoems.map(p => ({
      id: p.id,
      type: 'poem' as const,
      title: p.title,
      href: `/admin/poems`,
      date: p.createdAt,
    })),
    ...recentEvents.map(e => ({
      id: e.id,
      type: 'event' as const,
      title: e.title,
      href: `/admin/events`,
      date: e.createdAt,
    })),
    ...recentEnquiries.map(e => ({
      id: e.id,
      type: 'enquiry' as const,
      title: e.name,
      href: `/admin/enquiries`,
      date: e.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-heading text-3xl text-text-primary mb-2">
          डैशबोर्ड
        </h1>
        <p className="font-ui text-text-secondary">
          स्वागत है, {session.user?.name || 'Admin'}
        </p>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="कुल कविताएँ"
          value={totalPoems}
          icon="📝"
          href="/admin/poems"
        />
        <StatsCard
          title="प्रकाशित कविताएँ"
          value={publishedPoems}
          icon="✅"
        />
        <StatsCard
          title="आगामी आयोजन"
          value={upcomingEvents}
          icon="📅"
          href="/admin/events"
        />
        <StatsCard
          title="कुल आयोजन"
          value={totalEvents}
          icon="🎭"
        />
        <StatsCard
          title="नए संपर्क"
          value={unreadEnquiries}
          icon="📧"
          href="/admin/enquiries"
        />
        <StatsCard
          title="कुल संपर्क"
          value={totalEnquiries}
          icon="💬"
        />
        <StatsCard
          title="प्रस्तुतियाँ"
          value={totalPerformances}
          icon="🎬"
          href="/admin/performances"
        />
        <StatsCard
          title="पुस्तकें"
          value={totalBooks}
          icon="📚"
          href="/admin/books"
        />
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="font-heading text-xl text-text-primary mb-4">
          हाल की गतिविधि
        </h2>
        <RecentActivity items={recentItems} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/poems"
          className="p-6 bg-bg-secondary border border-divider rounded-sm hover:border-divider-strong transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h3 className="font-heading text-lg text-text-primary">
                नई कविता जोड़ें
              </h3>
              <p className="font-ui text-sm text-text-muted">
                कविता बनाएं और प्रकाशित करें
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/events/new"
          className="p-6 bg-bg-secondary border border-divider rounded-sm hover:border-divider-strong transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h3 className="font-heading text-lg text-text-primary">
                नया आयोजन जोड़ें
              </h3>
              <p className="font-ui text-sm text-text-muted">
                आगामी शो जोड़ें
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/notifications"
          className="p-6 bg-bg-secondary border border-divider rounded-sm hover:border-divider-strong transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <h3 className="font-heading text-lg text-text-primary">
                सूचना भेजें
              </h3>
              <p className="font-ui text-sm text-text-muted">
                अनुयायियों को सूचित करें
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

