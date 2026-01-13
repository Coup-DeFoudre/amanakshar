export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-text-muted border-t-text-primary rounded-full animate-spin" />
        <p className="mt-4 font-ui text-text-muted text-sm">
          लोड हो रहा है...
        </p>
      </div>
    </div>
  )
}

