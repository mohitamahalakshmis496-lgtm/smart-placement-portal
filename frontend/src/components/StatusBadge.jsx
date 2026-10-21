// Central map of status text -> visual treatment so every dashboard
// renders the same status the same way. Soft, translucent fills read
// better than solid pastels against the dark navy surfaces.
const STYLES = {
  applied: 'bg-slate-500/15 text-slate-300 border border-slate-500/25',
  pending: 'bg-amber-600/15 text-amber-400 border border-amber-600/30',
  shortlisted: 'bg-teal-600/15 text-teal-400 border border-teal-600/30',
  selected: 'bg-teal-500 text-navy-900 font-semibold',
  rejected: 'bg-rust-600/15 text-rust-400 border border-rust-600/30',
  approved: 'bg-teal-600/15 text-teal-400 border border-teal-600/30',
}

export default function StatusBadge({ status }) {
  const key = (status || '').toLowerCase()
  const style = STYLES[key] || 'bg-slate-500/15 text-slate-300 border border-slate-500/25'
  return (
    <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${style}`}>
      {status || 'Unknown'}
    </span>
  )
}
