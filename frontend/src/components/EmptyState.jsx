export default function EmptyState({ title = 'Nothing here yet', hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-14 text-center border border-dashed border-navy-600 rounded bg-navy-800">
      <p className="text-sm font-medium text-slate-200">{title}</p>
      {hint && <p className="text-sm text-slate-400 max-w-xs">{hint}</p>}
    </div>
  )
}
