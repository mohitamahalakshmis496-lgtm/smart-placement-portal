import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { toFriendlyMessage } from '../../api/errors'
import { asArray } from '../../api/normalize'
import { companyNav } from '../../constants/nav'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'

const initialForm = {
  title: '',
  description: '',
  location: '',
  package: '',
  minimumCGPA: '',
  allowedBranches: '',
  maxBacklogs: '0',
  applicationDeadline: '',
}

export default function CompanyJobs() {
  const [jobs, setJobs] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [closingJobId, setClosingJobId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const update = (field, value) => {
    setForm((f) => ({
      ...f,
      [field]: value,
    }))
  }

  async function load() {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get('/company/jobs')

      setJobs(
        Array.isArray(data?.jobs)
          ? data.jobs
          : asArray(data)
      )
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Unable to load your jobs. Please try again.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function submit(e) {
    e.preventDefault()

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/company/jobs', {
        ...form,
        package: Number(form.package),
        minimumCGPA: Number(form.minimumCGPA),
        maxBacklogs:
          form.maxBacklogs === ''
            ? 0
            : Number(form.maxBacklogs),
        allowedBranches: form.allowedBranches
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
      })

      setForm(initialForm)

      setSuccess(
        'Job posted successfully. It is waiting for Admin approval.'
      )

      await load()
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Could not post this job. Please try again.'
        )
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCloseJob(jobId) {
    const confirmed = window.confirm(
      'Are you sure you want to close this job?\n\n' +
      'Students will no longer be able to see or apply to it, ' +
      'but existing applications will remain.'
    )

    if (!confirmed) {
      return
    }

    setClosingJobId(jobId)
    setError('')
    setSuccess('')

    try {
      await api.put(`/company/jobs/${jobId}/close`)

      setSuccess(
        'Job closed successfully. Existing applications have been preserved.'
      )

      await load()
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Could not close this job. Please try again.'
        )
      )
    } finally {
      setClosingJobId(null)
    }
  }

  return (
    <DashboardLayout
      title="My Jobs"
      navItems={companyNav}
    >
      <div className="mx-auto w-full max-w-7xl space-y-6">

        {/* PAGE HEADER */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-400">
            Opportunities
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            My Jobs
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Create placement opportunities and monitor their approval status.
          </p>
        </div>

        {/* CREATE JOB */}
        <div className="modern-card p-6 sm:p-8">

          <h2 className="text-xl font-bold text-white">
            Post a new opportunity
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Approved jobs become visible to eligible students.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-rust-600/30 bg-rust-600/10 px-4 py-3 text-sm text-rust-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-xl border border-teal-600/30 bg-teal-600/10 px-4 py-3 text-sm text-teal-400">
              {success}
            </div>
          )}

          <form
            onSubmit={submit}
            className="mt-6 grid gap-5 sm:grid-cols-2"
          >

            <Field
              label="Job Title"
              required
            >
              <input
                className="modern-input"
                required
                value={form.title}
                onChange={(e) =>
                  update('title', e.target.value)
                }
                placeholder="Software Engineer"
              />
            </Field>

            <Field
              label="Location"
              required
            >
              <input
                className="modern-input"
                required
                value={form.location}
                onChange={(e) =>
                  update('location', e.target.value)
                }
                placeholder="Chennai"
              />
            </Field>

            <Field
              label="Package (LPA)"
              required
            >
              <input
                className="modern-input"
                type="number"
                min="0"
                step="0.1"
                required
                value={form.package}
                onChange={(e) =>
                  update('package', e.target.value)
                }
                placeholder="8"
              />
            </Field>

            <Field
              label="Minimum CGPA"
              required
            >
              <input
                className="modern-input"
                type="number"
                min="0"
                max="10"
                step="0.01"
                required
                value={form.minimumCGPA}
                onChange={(e) =>
                  update('minimumCGPA', e.target.value)
                }
                placeholder="7.5"
              />
            </Field>

            <Field label="Maximum Backlogs">
              <input
                className="modern-input"
                type="number"
                min="0"
                step="1"
                value={form.maxBacklogs}
                onChange={(e) =>
                  update('maxBacklogs', e.target.value)
                }
              />
            </Field>

            <Field
              label="Application Deadline"
              required
            >
              <input
                className="modern-input"
                type="date"
                required
                value={form.applicationDeadline}
                onChange={(e) =>
                  update(
                    'applicationDeadline',
                    e.target.value
                  )
                }
              />
            </Field>

            <Field
              label="Allowed Branches"
              full
              required
            >
              <input
                className="modern-input"
                required
                value={form.allowedBranches}
                onChange={(e) =>
                  update(
                    'allowedBranches',
                    e.target.value
                  )
                }
                placeholder="CSE, IT, AI & ML"
              />

              <p className="mt-1 text-xs text-slate-500">
                Separate branches with commas.
              </p>
            </Field>

            <Field
              label="Description"
              full
              required
            >
              <textarea
                className="modern-input min-h-32 resize-y"
                required
                value={form.description}
                onChange={(e) =>
                  update(
                    'description',
                    e.target.value
                  )
                }
                placeholder="Describe the role, responsibilities and expectations..."
              />
            </Field>

            <div className="flex justify-end sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting
                  ? 'Posting…'
                  : 'Post Job'}
              </button>
            </div>

          </form>
        </div>

        {/* EXISTING JOBS */}
        <div>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">
              Existing Jobs
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Your current opportunities and their approval state.
            </p>
          </div>

          {loading ? (
            <Loading label="Loading jobs…" />
          ) : error && !jobs.length ? (
            <ErrorMessage
              message={error}
              onRetry={load}
            />
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No jobs posted yet."
              hint="Use the form above to create your first opportunity."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {jobs.map((job) => (
                <article
                  key={job._id}
                  className="modern-card p-5"
                >

                  {/* JOB HEADER */}
                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {job.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {job.location ||
                          'Location not specified'}
                      </p>
                    </div>

                    <StatusBadge
                      status={
                        job.closed
                          ? 'Closed'
                          : job.approved
                            ? 'Approved'
                            : 'Pending'
                      }
                    />

                  </div>

                  {/* JOB DETAILS */}
                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <Mini
                      label="Package"
                      value={`${job.package ?? '—'} LPA`}
                    />

                    <Mini
                      label="Min CGPA"
                      value={
                        job.minimumCGPA ?? '—'
                      }
                    />

                    <Mini
                      label="Backlogs"
                      value={
                        job.maxBacklogs ?? 0
                      }
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

                  {/* BRANCHES */}
                  <div className="mt-4 flex flex-wrap gap-2">

                    {(job.allowedBranches || []).map(
                      (branch) => (
                        <span
                          key={branch}
                          className="rounded-full border border-navy-600 bg-navy-900 px-3 py-1 text-xs text-slate-300"
                        >
                          {branch}
                        </span>
                      )
                    )}

                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                    {job.description}
                  </p>

                  {/* ACTIONS */}
                  {!job.closed && (
                    <div className="mt-5 flex justify-end">

                      <button
                        type="button"
                        onClick={() =>
                          handleCloseJob(job._id)
                        }
                        disabled={
                          closingJobId === job._id
                        }
                        className="btn-secondary"
                      >
                        {closingJobId === job._id
                          ? 'Closing…'
                          : 'Remove'}
                      </button>

                    </div>
                  )}

                  {/* CLOSED MESSAGE */}
                  {job.closed && (
                    <div className="mt-5 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3">
                      <p className="text-xs font-semibold text-slate-400">
                        This job is closed
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Students can no longer see or apply
                        to this opportunity. Existing
                        applications are preserved.
                      </p>
                    </div>
                  )}

                </article>
              ))}

            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  )
}

function Field({
  label,
  children,
  full,
  required,
}) {
  return (
    <div
      className={
        full ? 'sm:col-span-2' : ''
      }
    >
      <label className="modern-label">
        {label}
        {required ? ' *' : ''}
      </label>

      {children}
    </div>
  )
}

function Mini({ label, value }) {
  return (
    <div className="rounded-lg border border-navy-600 bg-navy-900 p-3">

      <p className="text-[11px] uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        {value}
      </p>

    </div>
  )
}