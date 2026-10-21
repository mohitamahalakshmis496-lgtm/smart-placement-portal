import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { toFriendlyMessage } from '../../api/errors'
import { asArray } from '../../api/normalize'
import { adminNav } from '../../constants/nav'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [approving, setApproving] = useState(null)
  const [success, setSuccess] = useState('')

  async function loadCompanies() {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get('/admin/pending-companies')

      setCompanies(
        Array.isArray(data?.companies)
          ? data.companies
          : asArray(data)
      )
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Unable to load pending companies.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  async function approveCompany(company) {
    const id = company._id || company.id

    setApproving(id)
    setError('')
    setSuccess('')

    try {
      await api.put(`/admin/approve-company/${id}`)

      setSuccess(
        `${company.name || 'Company'} has been approved successfully.`
      )

      await loadCompanies()
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Could not approve this company.'
        )
      )
    } finally {
      setApproving(null)
    }
  }

  return (
    <DashboardLayout title="Companies" navItems={adminNav}>
      <div className="mx-auto w-full max-w-7xl space-y-6">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-400">
            Verification
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Company Approvals
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Review companies waiting for Admin approval.
          </p>
        </div>

        {success && (
          <div className="rounded-xl border border-teal-600/30 bg-teal-600/10 px-4 py-3 text-sm text-teal-400">
            {success}
          </div>
        )}

        {loading ? (
          <Loading label="Loading pending companies…" />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={loadCompanies}
          />
        ) : companies.length === 0 ? (
          <EmptyState
            title="No pending companies."
            hint="All company registrations are currently processed."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {companies.map(company => {
              const id = company._id || company.id

              return (
                <article
                  key={id}
                  className="modern-card p-5"
                >
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600/15 font-bold text-teal-400">
                        {getInitials(company.name)}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-white">
                          {company.name || 'Company'}
                        </h2>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          {company.email || 'No email'}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status="Pending" />

                  </div>

                  <div className="mt-5 rounded-xl border border-navy-600 bg-navy-900 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Registration Status
                    </p>

                    <p className="mt-2 text-sm text-slate-300">
                      This company is waiting for Admin verification.
                    </p>
                  </div>

                  <button
                    disabled={approving === id}
                    onClick={() => approveCompany(company)}
                    className="btn-primary mt-5 w-full"
                  >
                    {approving === id
                      ? 'Approving…'
                      : 'Approve Company'}
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

function getInitials(name) {
  if (!name) return 'CO'

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
}