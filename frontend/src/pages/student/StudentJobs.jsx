import { useEffect, useMemo, useState } from 'react'
import api from '../../api/axios'
import { toFriendlyMessage } from '../../api/errors'
import { asArray, displayText } from '../../api/normalize'
import { studentNav } from '../../constants/nav'
import DashboardLayout from '../../components/DashboardLayout'
import JobCard from '../../components/JobCard'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'

export default function StudentJobs() {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applyingId, setApplyingId] = useState(null)

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [company, setCompany] = useState('')
  const [sortByPackage, setSortByPackage] = useState(false)

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
          'Unable to load jobs. Please try again.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const appliedJobIds = useMemo(
    () =>
      new Set(
        applications.map(
          (application) =>
            application.jobId ||
            application.job?._id ||
            application.job
        )
      ),
    [applications]
  )

  const locations = useMemo(
    () =>
      [
        ...new Set(
          jobs
            .map((job) => job.location)
            .filter(Boolean)
        ),
      ],
    [jobs]
  )

  const companies = useMemo(
    () =>
      [
        ...new Set(
          jobs
            .map(
              (job) =>
                job.companyName ||
                displayText(job.company)
            )
            .filter(Boolean)
        ),
      ],
    [jobs]
  )

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const companyLabel =
        job.companyName ||
        displayText(job.company)

      const searchValue = search.toLowerCase()

      const matchesSearch =
        !search ||
        job.title
          ?.toLowerCase()
          .includes(searchValue) ||
        companyLabel
          .toLowerCase()
          .includes(searchValue)

      const matchesLocation =
        !location ||
        job.location === location

      const matchesCompany =
        !company ||
        companyLabel === company

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCompany
      )
    })

    if (sortByPackage) {
      result = [...result].sort(
        (a, b) =>
          parsePackage(b.package) -
          parsePackage(a.package)
      )
    }

    return result
  }, [
    jobs,
    search,
    location,
    company,
    sortByPackage,
  ])

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
          'Could not submit your application. Please try again.'
        )
      )
    } finally {
      setApplyingId(null)
    }
  }

  return (
    <DashboardLayout
      title="Jobs"
      navItems={studentNav}
    >
      <div className="bg-navy-800 border border-navy-600 rounded p-4 mb-6 shadow-card flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by title or company"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border border-navy-600 bg-navy-900 text-slate-50 placeholder:text-slate-500 rounded px-3 py-2 text-sm flex-1 min-w-[200px]"
        />

        <select
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          className="border border-navy-600 bg-navy-900 text-slate-50 rounded px-3 py-2 text-sm"
        >
          <option value="">
            All locations
          </option>

          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          value={company}
          onChange={(e) =>
            setCompany(e.target.value)
          }
          className="border border-navy-600 bg-navy-900 text-slate-50 rounded px-3 py-2 text-sm"
        >
          <option value="">
            All companies
          </option>

          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-slate-300 px-1">
          <input
            type="checkbox"
            checked={sortByPackage}
            onChange={(e) =>
              setSortByPackage(
                e.target.checked
              )
            }
          />
          Sort by package
        </label>
      </div>

      {loading ? (
        <Loading label="Loading jobs…" />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={loadData}
        />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="No eligible jobs available."
          hint="Approved jobs appear here when your CGPA, branch and backlog count satisfy the company's requirements."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => {
            const id = job._id || job.id

            return (
              <JobCard
                key={id}
                job={job}
                applied={appliedJobIds.has(id)}
                applying={applyingId === id}
                onApply={handleApply}
              />
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}

function parsePackage(pkg) {
  if (!pkg) return 0

  const num = parseFloat(
    String(pkg).replace(
      /[^0-9.]/g,
      ''
    )
  )

  return Number.isNaN(num) ? 0 : num
}