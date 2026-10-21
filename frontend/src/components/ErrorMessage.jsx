export default function ErrorMessage({ message = 'Unable to load this. Please try again.', onRetry }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 px-4 border border-rust-600/30 bg-rust-600/15 rounded text-sm text-rust-400">
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-rust-400 font-medium underline underline-offset-2 hover:text-rust-400/80 shrink-0"
        >
          Retry
        </button>
      )}
    </div>
  )
}
