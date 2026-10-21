import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { toFriendlyMessage } from '../../api/errors'
import { asArray, displayText } from '../../api/normalize'
import { studentNav } from '../../constants/nav'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'

const STAGES = ['Applied', 'Shortlisted', 'Selected']

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function Timeline({ status }) {
  const normalized = (status || '').toLowerCase()

  const rejected = normalized === 'rejected'

  const currentIndex = STAGES.findIndex(
    (stage) => stage.toLowerCase() === normalized
  )

  return (
    <div className="mt-3 flex items-center gap-1.5">
      {STAGES.map((stage, index) => {
        const reached =
          !rejected && currentIndex >= index

        return (
          <div
            key={stage}
            className="flex items-center gap-1.5"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                reached
                  ? 'bg-teal-600'
                  : 'bg-navy-700'
              }`}
              title={stage}
            />

            {index < STAGES.length - 1 && (
              <span
                className={`h-px w-6 ${
                  reached
                    ? 'bg-teal-600'
                    : 'bg-navy-700'
                }`}
              />
            )}
          </div>
        )
      })}

      {rejected && (
        <span className="ml-1 text-xs text-rust-400">
          Not selected
        </span>
      )}
    </div>
  )
}

export default function StudentApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get(
        '/student/applications'
      )

      setApplications(asArray(data))
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Unable to load your applications. Please try again.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <DashboardLayout
      title="Applications"
      navItems={studentNav}
    >
      {loading ? (
        <Loading label="Loading applications…" />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={load}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          title="You haven't applied to any jobs yet."
          hint="Browse the Jobs page to get started."
        />
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div
              key={app._id || app.id}
              className="modern-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <p className="text-lg font-semibold text-slate-50">
                  {app.jobTitle ||
                    app.job?.title ||
                    'Job Application'}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {app.companyName ||
                    displayText(app.job?.company) ||
                    'Company'}
                  {' · '}
                  {app.location ||
                    displayText(app.job?.location) ||
                    'Location'}
                  {' · '}
                  {app.package ||
                    displayText(app.job?.package) ||
                    'Package not specified'}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Applied{' '}
                  {formatDate(
                    app.appliedDate ||
                      app.createdAt
                  )}
                </p>

                <Timeline status={app.status} />
              </div>

              <div className="shrink-0">
                <StatusBadge
                  status={app.status}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}