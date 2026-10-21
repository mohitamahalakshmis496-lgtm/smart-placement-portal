export default function StatCard({ label, value, accent = 'navy' }) {
  const accents = {
    navy: 'border-l-gold-500',
    teal: 'border-l-teal-600',
    amber: 'border-l-amber-600',
    rust: 'border-l-rust-600',
  }

  return (
    <div className={`bg-navy-800 border border-navy-600 border-l-4 ${accents[accent]} rounded p-4 shadow-card`}>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-serif font-semibold text-slate-50 mt-1">{value}</p>
    </div>
  )
}
