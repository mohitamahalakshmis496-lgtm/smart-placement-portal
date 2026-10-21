export default function Loading({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-3 py-10 justify-center text-slate-400">
      <span
        className="h-4 w-4 rounded-full border-2 border-navy-600 border-t-gold-500 animate-spin"
        aria-hidden="true"
      />
      <span className="text-sm">{label}</span>
    </div>
  )
}
