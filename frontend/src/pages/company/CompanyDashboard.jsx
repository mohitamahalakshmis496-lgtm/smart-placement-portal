import { useEffect, useMemo, useState } from 'react'
import api from '../../api/axios'
import { getUser } from '../../api/auth'
import { toFriendlyMessage } from '../../api/errors'
import { asArray, displayText } from '../../api/normalize'
import { companyNav } from '../../constants/nav'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import StatusBadge from '../../components/StatusBadge'

export default function CompanyDashboard() {
  const user = getUser()
  const [jobs, setJobs] = useState([])
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true); setError('')
    try {
      const [jobsRes, applicantsRes] = await Promise.all([
        api.get('/company/jobs'),
        api.get('/company/applicants'),
      ])
      setJobs(Array.isArray(jobsRes.data?.jobs) ? jobsRes.data.jobs : asArray(jobsRes.data))
      setApplicants(asArray(applicantsRes.data))
    } catch (err) {
      setError(toFriendlyMessage(err, 'Unable to load your dashboard. Please try again.'))
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const approved = useMemo(() => jobs.filter((j) => j.approved).length, [jobs])
  const pending = jobs.length - approved
  const pipeline = useMemo(() => ({
    Applied: applicants.filter((a) => (a.status || 'Applied') === 'Applied').length,
    Shortlisted: applicants.filter((a) => a.status === 'Shortlisted').length,
    Selected: applicants.filter((a) => a.status === 'Selected').length,
  }), [applicants])

  return <DashboardLayout title="Dashboard" navItems={companyNav}>
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="modern-card relative overflow-hidden p-6 sm:p-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-400">Recruiter Workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Welcome back, {user?.name || 'Company'}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Manage placement opportunities, monitor applications and track your recruitment pipeline.</p>
        </div>
      </div>

      {loading ? <Loading label="Loading your dashboard…" /> : error ? <ErrorMessage message={error} onRetry={load} /> : <>
        <section>
          <div className="mb-4"><h2 className="text-xl font-bold text-white">Recruitment Overview</h2><p className="mt-1 text-sm text-slate-400">Live statistics from your company workspace.</p></div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Jobs Posted" value={jobs.length} accent="navy" />
            <StatCard label="Approved Jobs" value={approved} accent="teal" />
            <StatCard label="Pending Jobs" value={pending} accent="amber" />
            <StatCard label="Applicants" value={applicants.length} accent="navy" />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="modern-card p-6 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-400">Applicant Pipeline</p>
            <h2 className="mt-1 text-xl font-bold text-white">Candidate movement</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {Object.entries(pipeline).map(([label, value]) => <div key={label} className="rounded-xl border border-navy-600 bg-navy-900 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-white">{value}</p><div className="mt-4 h-2 rounded-full bg-navy-700"><div className="h-2 rounded-full bg-teal-500" style={{ width: `${applicants.length ? Math.round((value / applicants.length) * 100) : 0}%` }} /></div></div>)}
            </div>
          </div>
          <div className="modern-card p-6"><p className="text-xs font-bold uppercase tracking-wider text-teal-400">Workspace</p><h2 className="mt-1 text-xl font-bold text-white">Recruitment Ready</h2><p className="mt-3 text-sm leading-6 text-slate-400">Create jobs, wait for approval, then manage candidates from the Applicants page.</p><div className="mt-5 flex gap-2"><a className="btn-primary" href="/company/jobs">Manage Jobs</a><a className="btn-secondary" href="/company/applicants">Applicants</a></div></div>
        </section>

        <section className="modern-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-navy-600 p-6"><div><p className="text-xs font-bold uppercase tracking-wider text-teal-400">Opportunities</p><h2 className="mt-1 text-xl font-bold text-white">Recent Jobs</h2></div><a href="/company/jobs" className="btn-secondary">View all</a></div>
          {jobs.length === 0 ? <div className="p-8 text-center text-sm text-slate-400">No jobs posted yet.</div> : <div className="overflow-x-auto"><table className="modern-table"><thead><tr><th>Job</th><th>Location</th><th>Package</th><th>Min CGPA</th><th>Status</th></tr></thead><tbody>{jobs.slice(0,5).map((job) => <tr key={job._id}><td><p className="font-semibold text-white">{job.title}</p><p className="mt-1 text-xs text-slate-500">{job.allowedBranches?.join(', ') || 'All branches'}</p></td><td>{job.location || '—'}</td><td>{job.package ?? '—'} LPA</td><td>{job.minimumCGPA ?? '—'}</td><td><StatusBadge status={job.approved ? 'Approved' : 'Pending'} /></td></tr>)}</tbody></table></div>}
        </section>

        <section className="modern-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-navy-600 p-6"><div><p className="text-xs font-bold uppercase tracking-wider text-teal-400">Candidate Activity</p><h2 className="mt-1 text-xl font-bold text-white">Recent Applicants</h2></div><a href="/company/applicants" className="btn-secondary">View all</a></div>
          {applicants.length === 0 ? <div className="p-8 text-center text-sm text-slate-400">No applications yet.</div> : <div className="overflow-x-auto"><table className="modern-table"><thead><tr><th>Student</th><th>Job</th><th>Branch</th><th>CGPA</th><th>Status</th></tr></thead><tbody>{applicants.slice(0,5).map((a) => <tr key={a._id}><td><p className="font-semibold text-white">{a.student?.name || 'Student'}</p><p className="text-xs text-slate-500">{a.student?.rollNo || '—'}</p></td><td>{a.job?.title || displayText(a.job) || '—'}</td><td>{a.student?.branch || '—'}</td><td>{a.student?.cgpa ?? '—'}</td><td><StatusBadge status={a.status || 'Applied'} /></td></tr>)}</tbody></table></div>}
        </section>
      </>}
    </div>
  </DashboardLayout>
}
