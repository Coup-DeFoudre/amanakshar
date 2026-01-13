'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Bhav {
  name: string
  slug: string
}

interface PoemFiltersProps {
  bhavs: Bhav[]
  selectedBhav?: string
  selectedYear?: string
  years: number[]
}

export function PoemFilters({ bhavs, selectedBhav, selectedYear, years }: PoemFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/kavitayen?${params.toString()}`)
  }
  
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {/* Bhav Filter */}
      <div className="flex items-center gap-2 font-ui text-sm">
        <span className="text-text-muted">भाव:</span>
        <button
          onClick={() => updateFilter('bhav', null)}
          className={`px-2 py-1 transition-colors ${
            !selectedBhav ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          सभी
        </button>
        {bhavs.map((bhav) => (
          <button
            key={bhav.slug}
            onClick={() => updateFilter('bhav', bhav.slug)}
            className={`px-2 py-1 transition-colors ${
              selectedBhav === bhav.slug ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {bhav.name}
          </button>
        ))}
      </div>
      
      {/* Year Filter (if years available) */}
      {years.length > 0 && (
        <div className="flex items-center gap-2 font-ui text-sm">
          <span className="text-text-muted">वर्ष:</span>
          <select
            value={selectedYear || ''}
            onChange={(e) => updateFilter('year', e.target.value || null)}
            className="bg-transparent text-text-secondary border-none cursor-pointer focus:outline-none"
          >
            <option value="">सभी</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

