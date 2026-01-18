interface StatsCardProps {
  title: string
  value: number | string
  icon: string
  href?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({ title, value, icon, href, trend }: StatsCardProps) {
  const content = (
    <div className="p-6 bg-bg-secondary border border-divider rounded-sm hover:border-divider-strong transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-ui text-sm text-text-muted mb-1">{title}</p>
          <p className="font-heading text-3xl text-text-primary">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-ui ${
          trend.isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    )
  }

  return content
}
