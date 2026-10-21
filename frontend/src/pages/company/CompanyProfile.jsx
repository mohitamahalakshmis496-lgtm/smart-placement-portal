import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { toFriendlyMessage } from '../../api/errors'
import { companyNav } from '../../constants/nav'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import StatusBadge from '../../components/StatusBadge'

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadProfile() {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get('/company/profile')
      setProfile(data?.profile || null)
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Unable to load company profile. Please try again.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  if (loading) {
    return (
      <DashboardLayout title="Company Profile" navItems={companyNav}>
        <Loading label="Loading company profile…" />
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Company Profile" navItems={companyNav}>
        <ErrorMessage message={error} onRetry={loadProfile} />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Company Profile" navItems={companyNav}>
      <div className="mx-auto w-full max-w-5xl space-y-6">

        {/* Header */}
        <section className="modern-card overflow-hidden">
          <div className="bg-gradient-to-r from-navy-700 to-navy-800 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-3xl font-bold text-white">
                {getInitials(profile?.name)}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-400">
                  Recruiter Profile
                </p>

                <h1 className="mt-2 text-3xl font-bold text-white">
                  {profile?.name || 'Company'}
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  {profile?.email || 'Email not available'}
                </p>

                <div className="mt-3">
                  <StatusBadge
                    status={profile?.approved ? 'Approved' : 'Pending'}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Company information */}
        <section className="modern-card p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              Company Information
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Your registered company account information.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <Info
              label="Company Name"
              value={profile?.name}
            />

            <Info
              label="Email"
              value={profile?.email}
            />

            <Info
              label="Account Role"
              value={profile?.role}
            />

            <Info
              label="Approval Status"
              value={profile?.approved ? 'Approved by Admin' : 'Pending Admin Approval'}
            />

          </div>
        </section>

        {/* Account status */}
        <section className="modern-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white">
            Account Status
          </h2>

          <div
            className={`mt-5 rounded-xl border p-5 ${
              profile?.approved
                ? 'border-teal-600/30 bg-teal-600/10'
                : 'border-amber-600/30 bg-amber-600/10'
            }`}
          >
            <p
              className={`font-semibold ${
                profile?.approved
                  ? 'text-teal-400'
                  : 'text-amber-400'
              }`}
            >
              {profile?.approved
                ? 'Your company account is approved.'
                : 'Your company account is awaiting Admin approval.'}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {profile?.approved
                ? 'You can create job opportunities and manage applicants through the placement portal.'
                : 'You will be able to use the complete recruiter workflow after an Admin approves your company account.'}
            </p>
          </div>
        </section>

      </div>
    </DashboardLayout>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-navy-600 bg-navy-900 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold capitalize text-slate-100">
        {value || 'Not available'}
      </p>
    </div>
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