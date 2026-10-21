// Used for sections whose UI is built but which depend on a backend
// endpoint that doesn't exist yet. Never fake the data here — just
// say plainly what's missing so it's obvious what to wire up later.
export default function PendingFeature({ title, endpointNeeded }) {
  return (
    <div className="border border-dashed border-amber-600/30 bg-amber-600/10 rounded p-5 text-sm text-amber-400">
      <p className="font-medium">{title} isn't connected yet</p>
      <p className="mt-1 text-amber-400/80">
        This screen is ready, but it needs a backend endpoint that doesn't exist yet
        {endpointNeeded ? <> (<code className="font-mono">{endpointNeeded}</code>)</> : null}.
        Add it to the backend, then wire it into this page.
      </p>
    </div>
  )
}
