export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Ambient glow effect with enhanced animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-gradient-radial from-accent-glow via-transparent to-transparent opacity-30 animate-pulse" style={{ animationDuration: '3s' }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
          {/* Poet name skeleton */}
          <div className="h-4 bg-bg-elevated/50 rounded w-24 mx-auto mb-8 animate-pulse" />
          
          {/* Main tagline skeleton with stagger */}
          <div className="space-y-3 mb-12">
            <div className="h-12 sm:h-16 bg-bg-elevated/50 rounded w-4/5 mx-auto shimmer-refined" />
            <div className="h-12 sm:h-16 bg-bg-elevated/50 rounded w-3/5 mx-auto shimmer-refined" style={{ animationDelay: '150ms' }} />
          </div>
          
          {/* Decorative line */}
          <div className="w-16 h-px bg-accent-gold/20 mx-auto mb-8" />
          
          {/* Couplet skeleton */}
          <div className="max-w-xl mx-auto space-y-2">
            <div className="h-6 bg-bg-elevated/40 rounded w-full animate-pulse" style={{ animationDelay: '300ms' }} />
            <div className="h-6 bg-bg-elevated/40 rounded w-11/12 mx-auto animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
        
        {/* Scroll indicator skeleton with bounce animation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" style={{ animationDuration: '2s' }}>
          <div className="flex flex-col items-center gap-2">
            <div className="h-3 w-16 bg-bg-elevated/30 rounded" />
            <div className="w-5 h-8 border border-bg-elevated/30 rounded-full" />
          </div>
        </div>
        
        {/* Corner decorations with fade-in */}
        <div className="absolute top-20 left-8 w-12 h-12 border-l border-t border-accent-gold/10 animate-pulse" style={{ animationDuration: '2.5s' }} />
        <div className="absolute bottom-20 right-8 w-12 h-12 border-r border-b border-accent-gold/10 animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
      </section>

      {/* Video Section Skeleton */}
      <section className="py-20 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-3 bg-bg-elevated/40 rounded w-12 mx-auto mb-12" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Video placeholder */}
            <div className="relative">
              <div className="aspect-video bg-bg-elevated/30 rounded-lg animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-bg-elevated/50 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-text-muted/30 border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-accent-gold/20" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-accent-gold/20" />
            </div>
            
            {/* Content */}
            <div className="lg:pl-8 space-y-6">
              <div className="h-8 bg-bg-elevated/40 rounded w-3/4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 bg-bg-elevated/30 rounded w-full animate-pulse" />
                <div className="h-6 bg-bg-elevated/30 rounded w-5/6 animate-pulse" />
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div className="w-12 h-12 rounded-full bg-bg-elevated/40 animate-pulse" />
                <div className="h-5 bg-bg-elevated/30 rounded w-20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section Skeleton */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="h-3 bg-bg-elevated/40 rounded w-12 mx-auto mb-12" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square bg-bg-elevated/30 rounded-lg p-6 flex flex-col items-center justify-center gap-3 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-bg-elevated/50" />
                <div className="h-4 bg-bg-elevated/50 rounded w-16" />
                <div className="h-3 bg-bg-elevated/30 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Centered Section Skeleton */}
      <section className="py-28 sm:py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-3 bg-bg-elevated/40 rounded w-12 mx-auto mb-6" />
          <div className="h-14 bg-bg-elevated/40 rounded w-2/3 mx-auto mb-6 animate-pulse" />
          <div className="h-6 bg-bg-elevated/30 rounded w-1/2 mx-auto mb-10" />
          
          <div className="inline-block px-10 py-5 bg-bg-elevated/20 rounded-lg mb-12">
            <div className="h-8 bg-bg-elevated/40 rounded w-40 mx-auto animate-pulse" />
          </div>
          
          <div className="w-32 h-px bg-accent-gold/20 mx-auto mb-12" />
          
          <div className="flex flex-wrap justify-center gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-5 bg-bg-elevated/30 rounded w-32 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
