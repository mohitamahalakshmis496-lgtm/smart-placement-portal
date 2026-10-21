import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { toFriendlyMessage } from '../../api/errors'
import { asArray, displayText } from '../../api/normalize'
import { adminNav } from '../../constants/nav'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'

export default function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [approving, setApproving] = useState(null)
  const [success, setSuccess] = useState('')

  async function loadJobs() {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get('/admin/pending-jobs')

      setJobs(
        Array.isArray(data?.jobs)
          ? data.jobs
          : asArray(data)
      )
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Unable to load pending jobs.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  async function approveJob(job) {
    const id = job._id || job.id

    setApproving(id)
    setError('')
    setSuccess('')

    try {
      await api.put(`/admin/approve-job/${id}`)

      setSuccess(
        `${job.title || 'Job'} has been approved successfully.`
      )

      await loadJobs()
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Could not approve this job.'
        )
      )
    } finally {
      setApproving(null)
    }
  }

  return (
    <DashboardLayout title="Jobs" navItems={adminNav}>
      <div className="mx-auto w-full max-w-7xl space-y-6">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-400">
            Opportunity Verification
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Job Approvals
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Review newly posted company opportunities before
            they become visible to eligible students.
          </p>
        </div>

        {success && (
          <div className="rounded-xl border border-teal-600/30 bg-teal-600/10 px-4 py-3 text-sm text-teal-400">
            {success}
          </div>
        )}

        {loading ? (
          <Loading label="Loading pending jobs…" />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={loadJobs}
          />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No pending jobs."
            hint="There are currently no job opportunities waiting for Admin approval."
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">

            {jobs.map(job => {
              const id = job._id || job.id
              const companyName =
                displayText(job.company, 'Company')

              return (
                <article
                  key={id}
                  className="modern-card p-6"
                >

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-teal-400">
                        {companyName}
                      </p>

                      <h2 className="mt-2 text-xl font-bold text-white">
                        {job.title || 'Untitled Job'}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        {job.location || 'Location not specified'}
                      </p>
                    </div>

                    <StatusBadge status="Pending" />

                  </div>

                  {/* Job details */}
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

                    <Mini
                      label="Package"
                      value={
                        job.package !== undefined
                          ? `${job.package} LPA`
                          : '—'
                      }
                    />

                    <Mini
                      label="Min CGPA"
                      value={job.minimumCGPA ?? '—'}
                    />

                    <Mini
                      label="Backlogs"
                      value={job.maxBacklogs ?? 0}
                    />

                    <Mini
                      label="Deadline"
                      value={
                        job.applicationDeadline
                          ? new Date(
                              job.applicationDeadline
                            ).toLocaleDateString()
                          : '—'
                      }
                    />

                  </div>

                  {/* Branches */}
                  {Array.isArray(job.allowedBranches) &&
                    job.allowedBranches.length > 0 && (
                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Allowed Branches
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {job.allowedBranches.map(branch => (
                            <span
                              key={branch}
                              className="rounded-full border border-navy-600 bg-navy-900 px-3 py-1 text-xs text-slate-300"
                            >
                              {branch}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Description */}
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Description
                    </p>

                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-400">
                      {job.description ||
                        'No description provided.'}
                    </p>
                  </div>

                  {/* Approve */}
                  <button
                    disabled={approving === id}
                    onClick={() => approveJob(job)}
                    className="btn-primary mt-6 w-full"
                  >
                    {approving === id
                      ? 'Approving…'
                      : 'Approve Job'}
                  </button>

                </article>
              )
            })}

          </div>
        )}

      </div>
    </DashboardLayout>
  )
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl border border-navy-600 bg-navy-900 p-3">
      <p className="text-[11px] uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  )
}