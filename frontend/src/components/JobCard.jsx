import { displayText } from '../api/normalize'

function formatDeadline(deadline) {
  if (!deadline) return '—'

  const d = new Date(deadline)

  if (Number.isNaN(d.getTime())) {
    return deadline
  }

  return d.toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  )
}


export default function JobCard({
  job,
  applied,
  onApply,
  applying,
  onViewDetails,
}) {
  const branches = Array.isArray(
    job.allowedBranches
  )
    ? job.allowedBranches.join(', ')
    : job.allowedBranches

  const companyLabel =
    job.companyName ||
    displayText(job.company)

  const minimumCGPA =
    job.minimumCGPA ??
    job.minCGPA

  const maximumBacklogs =
    job.maxBacklogs ??
    job.maximumBacklogs

  const deadline =
    job.applicationDeadline ??
    job.deadline

  return (
    <div className="bg-navy-800 border border-navy-600 rounded p-5 shadow-card flex flex-col gap-3">

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold font-serif text-slate-50 leading-snug">
            {job.title}
          </h3>

          <p className="text-sm text-slate-400">
            {companyLabel}
          </p>
        </div>

        {job.package !== undefined &&
          job.package !== null &&
          job.package !== '' && (
            <span className="text-sm font-medium text-teal-400 whitespace-nowrap">
              {job.package}
            </span>
          )}
      </div>


      {job.description && (
        <p className="text-sm text-slate-300 line-clamp-3">
          {job.description}
        </p>
      )}


      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-slate-300 mt-1">

        {job.location && (
          <div className="flex justify-between gap-2 border-b border-navy-700 py-1">
            <dt className="text-slate-400">
              Location
            </dt>

            <dd className="text-right">
              {job.location}
            </dd>
          </div>
        )}


        {minimumCGPA !== undefined &&
          minimumCGPA !== null && (
            <div className="flex justify-between gap-2 border-b border-navy-700 py-1">
              <dt className="text-slate-400">
                Min. CGPA
              </dt>

              <dd className="text-right">
                {minimumCGPA}
              </dd>
            </div>
          )}


        {branches && (
          <div className="flex justify-between gap-2 border-b border-navy-700 py-1 col-span-2">
            <dt className="text-slate-400 shrink-0">
              Branches
            </dt>

            <dd className="text-right">
              {branches}
            </dd>
          </div>
        )}


        {maximumBacklogs !== undefined &&
          maximumBacklogs !== null && (
            <div className="flex justify-between gap-2 border-b border-navy-700 py-1">
              <dt className="text-slate-400">
                Max backlogs
              </dt>

              <dd className="text-right">
                {maximumBacklogs}
              </dd>
            </div>
          )}


        <div className="flex justify-between gap-2 border-b border-navy-700 py-1">
          <dt className="text-slate-400">
            Deadline
          </dt>

          <dd className="text-right">
            {formatDeadline(deadline)}
          </dd>
        </div>

      </dl>


      <div className="flex items-center gap-2 mt-1">

        {onViewDetails && (
          <button
            onClick={() =>
              onViewDetails(job)
            }
            className="text-sm font-medium text-slate-200 border border-navy-600 rounded px-3 py-1.5 hover:bg-navy-700"
          >
            View details
          </button>
        )}


        {applied ? (
          <span className="text-sm font-medium text-teal-400 bg-teal-600/15 border border-teal-600/30 rounded px-3 py-1.5">
            Already applied
          </span>
        ) : (
          onApply && (
            <button
              onClick={() =>
                onApply(job)
              }
              disabled={applying}
              className="text-sm font-semibold text-navy-900 bg-gold-500 rounded px-3 py-1.5 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applying
                ? 'Applying…'
                : 'Apply'}
            </button>
          )
        )}

      </div>

    </div>
  )
}