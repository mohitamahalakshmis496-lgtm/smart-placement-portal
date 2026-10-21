import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { getUser } from '../../api/auth'
import { toFriendlyMessage } from '../../api/errors'
import { asArray } from '../../api/normalize'
import { studentNav } from '../../constants/nav'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import JobCard from '../../components/JobCard'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'

export default function StudentDashboard() {
  const user = getUser()

  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applyingId, setApplyingId] = useState(null)

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/student/jobs'),
        api.get('/student/applications'),
      ])

      setJobs(asArray(jobsRes.data))
      setApplications(asArray(appsRes.data))
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Unable to load your dashboard.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const appliedJobIds = new Set(
    applications.map(
      (a) =>
        a.jobId ||
        a.job?._id ||
        a.job
    )
  )

  const shortlistedCount =
    applications.filter(
      (a) =>
        (a.status || '').toLowerCase() ===
        'shortlisted'
    ).length

  const selectedCount =
    applications.filter(
      (a) =>
        (a.status || '').toLowerCase() ===
        'selected'
    ).length

  async function handleApply(job) {
    const id = job._id || job.id

    setApplyingId(id)
    setError('')

    try {
      await api.post(`/student/apply/${id}`)
      await loadData()
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Could not submit your application.'
        )
      )
    } finally {
      setApplyingId(null)
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        title="Student Dashboard"
        subtitle="Your placement journey at a glance"
        navItems={studentNav}
      >
        <Loading label="Preparing your dashboard..." />
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        title="Student Dashboard"
        subtitle="Your placement journey at a glance"
        navItems={studentNav}
      >
        <ErrorMessage
          message={error}
          onRetry={loadData}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Student Dashboard"
      subtitle="Your placement journey at a glance"
      navItems={studentNav}
    >
      {/* Hero */}
      <section className="modern-card relative mb-6 overflow-hidden p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-light">
            Placement journey
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome back, {user?.name || 'Student'}.
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Keep your profile updated and explore opportunities
            that match your academic eligibility.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="badge badge-neutral">
              {user?.branch || 'Branch'}
            </span>

            {user?.cgpa !== undefined && (
              <span className="badge badge-success">
                CGPA {user.cgpa}
              </span>
            )}

            <span className="badge badge-neutral">
              {user?.backlogs ?? 0} backlogs
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Eligible Jobs"
          value={jobs.length}
          accent="navy"
          description="Matching your profile"
        />

        <StatCard
          label="Applications"
          value={applications.length}
          accent="teal"
          description="Submitted applications"
        />

        <StatCard
          label="Shortlisted"
          value={shortlistedCount}
          accent="amber"
          description="Recruiter responses"
        />

        <StatCard
          label="Selected"
          value={selectedCount}
          accent="teal"
          description="Successful applications"
        />
      </div>

      {/* Smart section */}
      <section className="modern-card mb-8 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary-light">
                ✦
              </span>

              <h2 className="font-bold text-white">
                Smart Placement Insights
              </h2>
            </div>

            <p className="mt-1 text-xs text-muted">
              AI-powered recommendations will appear here.
            </p>
          </div>

          <span className="badge badge-neutral">
            AI Center
          </span>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <SmartFeature
            title="Job Match"
            description="Find jobs that align with your profile, skills and eligibility."
          />

          <SmartFeature
            title="Skill Gap"
            description="Identify skills you should improve for your target roles."
          />
        </div>
      </section>

      {/* Jobs */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Recommended Opportunities
            </h2>

            <p className="mt-1 text-xs text-muted">
              Showing your most relevant eligible jobs
            </p>
          </div>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            title="No eligible jobs available."
            hint="Check back when companies post roles matching your profile."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.slice(0, 6).map((job) => (
              <JobCard
                key={job._id || job.id}
                job={job}
                applied={appliedJobIds.has(
                  job._id || job.id
                )}
                applying={
                  applyingId ===
                  (job._id || job.id)
                }
                onApply={handleApply}
              />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}

function SmartFeature({ title, description }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-4 transition hover:border-primary/30">
      <p className="text-sm font-semibold text-white">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-muted">
        {description}
      </p>

      <span className="mt-3 inline-block text-[11px] font-semibold text-primary-light">
        Coming soon →
      </span>
    </div>
  )
}