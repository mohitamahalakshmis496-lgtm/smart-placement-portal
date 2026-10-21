import { useEffect, useMemo, useState } from 'react'
import api from '../../api/axios'
import { toFriendlyMessage } from '../../api/errors'
import { studentNav } from '../../constants/nav'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import StatusBadge from '../../components/StatusBadge'
import StatCard from '../../components/StatCard'

export default function StudentProfile() {
  const [profile, setProfile] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [editing, setEditing] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    rollNo: '',
    branch: '',
    cgpa: '',
    backlogs: 0,
  })

  async function loadProfile() {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get('/student/profile')

      const student = data.profile || data

      setProfile(student)

      setForm({
        name: student?.name || '',
        email: student?.email || '',
        rollNo: student?.rollNo || '',
        branch: student?.branch || '',
        cgpa:
          student?.cgpa !== undefined &&
          student?.cgpa !== null
            ? student.cgpa
            : '',
        backlogs:
          student?.backlogs !== undefined &&
          student?.backlogs !== null
            ? student.backlogs
            : 0,
      })
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Unable to load your profile. Please try again.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleEdit() {
    setSuccess('')
    setError('')

    setForm({
      name: profile?.name || '',
      email: profile?.email || '',
      rollNo: profile?.rollNo || '',
      branch: profile?.branch || '',
      cgpa:
        profile?.cgpa !== undefined &&
        profile?.cgpa !== null
          ? profile.cgpa
          : '',
      backlogs:
        profile?.backlogs !== undefined &&
        profile?.backlogs !== null
          ? profile.backlogs
          : 0,
    })

    setEditing(true)
  }

  function handleCancel() {
    setError('')
    setSuccess('')
    setEditing(false)

    setForm({
      name: profile?.name || '',
      email: profile?.email || '',
      rollNo: profile?.rollNo || '',
      branch: profile?.branch || '',
      cgpa:
        profile?.cgpa !== undefined &&
        profile?.cgpa !== null
          ? profile.cgpa
          : '',
      backlogs:
        profile?.backlogs !== undefined &&
        profile?.backlogs !== null
          ? profile.backlogs
          : 0,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setSuccess('')

    const cgpa = Number(form.cgpa)
    const backlogs = Number(form.backlogs)

    if (!form.name.trim()) {
      setError('Full name is required.')
      return
    }

    if (!form.email.trim()) {
      setError('Email is required.')
      return
    }

    if (!form.rollNo.trim()) {
      setError('Roll number is required.')
      return
    }

    if (!form.branch.trim()) {
      setError('Branch is required.')
      return
    }

    if (
      form.cgpa === '' ||
      Number.isNaN(cgpa) ||
      cgpa < 0 ||
      cgpa > 10
    ) {
      setError('CGPA must be a number between 0 and 10.')
      return
    }

    if (
      form.backlogs === '' ||
      Number.isNaN(backlogs) ||
      backlogs < 0 ||
      !Number.isInteger(backlogs)
    ) {
      setError('Backlogs must be a non-negative whole number.')
      return
    }

    setSaving(true)

    try {
      const { data } = await api.put('/student/profile', {
        name: form.name.trim(),
        email: form.email.trim(),
        rollNo: form.rollNo.trim(),
        branch: form.branch.trim(),
        cgpa,
        backlogs,
      })

      const updatedProfile =
        data.profile ||
        data.student ||
        data

      setProfile(updatedProfile)

      setForm({
        name: updatedProfile?.name || '',
        email: updatedProfile?.email || '',
        rollNo: updatedProfile?.rollNo || '',
        branch: updatedProfile?.branch || '',
        cgpa:
          updatedProfile?.cgpa !== undefined &&
          updatedProfile?.cgpa !== null
            ? updatedProfile.cgpa
            : '',
        backlogs:
          updatedProfile?.backlogs !== undefined &&
          updatedProfile?.backlogs !== null
            ? updatedProfile.backlogs
            : 0,
      })

      setEditing(false)
      setSuccess('Profile updated successfully.')

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Unable to update your profile. Please try again.'
        )
      )
    } finally {
      setSaving(false)
    }
  }

  const profileCompletion = useMemo(() => {
    if (!profile) return 0

    const fields = [
      profile.name,
      profile.email,
      profile.rollNo,
      profile.branch,
      profile.cgpa,
      profile.backlogs !== undefined &&
        profile.backlogs !== null,
    ]

    const completed = fields.filter(Boolean).length

    return Math.round(
      (completed / fields.length) * 100
    )
  }, [profile])

  if (loading) {
    return (
      <DashboardLayout
        title="Profile"
        navItems={studentNav}
      >
        <Loading label="Loading profile…" />
      </DashboardLayout>
    )
  }

  if (error && !profile) {
    return (
      <DashboardLayout
        title="Profile"
        navItems={studentNav}
      >
        <ErrorMessage
          message={error}
          onRetry={loadProfile}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Profile"
      navItems={studentNav}
    >
      <div className="mx-auto w-full max-w-6xl space-y-6">

        {/* Page heading */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-light">
            Career Profile
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Student Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Manage your academic and personal information used
            for placement eligibility and career opportunities.
          </p>
        </div>

        {/* Messages */}
        {success && (
          <div className="rounded-xl border border-teal/20 bg-teal/10 px-4 py-3 text-sm text-teal">
            {success}
          </div>
        )}

        {error && profile && (
          <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Profile Hero */}
        <div className="modern-card relative overflow-hidden p-6 sm:p-8">

          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

          <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-teal/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">

            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-lg">
              {profile?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>

            {/* Basic info */}
            <div className="min-w-0 flex-1">

              <p className="text-xs font-bold uppercase tracking-wider text-primary-light">
                Student Profile
              </p>

              <h2 className="mt-1 truncate text-2xl font-bold text-white">
                {profile?.name || 'Student'}
              </h2>

              <p className="mt-1 truncate text-sm text-muted">
                {profile?.email || 'No email available'}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {profile?.branch && (
                  <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-slate-300">
                    {profile.branch}
                  </span>
                )}

                {profile?.rollNo && (
                  <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-slate-300">
                    {profile.rollNo}
                  </span>
                )}

                <StatusBadge
                  status={
                    profile?.approved
                      ? 'Approved'
                      : 'Pending'
                  }
                />

              </div>
            </div>

            {/* Completion */}
            <div className="w-full max-w-xs lg:w-64">

              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">
                  Profile Completion
                </span>

                <span className="text-sm font-bold text-white">
                  {profileCompletion}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${profileCompletion}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[11px] text-subtle">
                Keep your profile updated for accurate placement matching.
              </p>

            </div>

            {/* Edit */}
            <button
              type="button"
              onClick={handleEdit}
              className="btn-primary shrink-0"
            >
              Edit Profile
            </button>

          </div>
        </div>

        {/* Academic Overview */}
        <section>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">
              Academic Overview
            </h2>

            <p className="mt-1 text-sm text-muted">
              Key academic information used for job eligibility.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">

            <StatCard
              label="CGPA"
              value={
                profile?.cgpa !== undefined &&
                profile?.cgpa !== null
                  ? profile.cgpa
                  : '—'
              }
              accent="teal"
            />

            <StatCard
              label="Branch"
              value={profile?.branch || '—'}
              accent="navy"
            />

            <StatCard
              label="Backlogs"
              value={profile?.backlogs ?? 0}
              accent={
                profile?.backlogs > 0
                  ? 'amber'
                  : 'teal'
              }
            />

          </div>
        </section>

        {/* Profile Details */}
        {!editing && (
          <section className="modern-card p-6">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                Personal & Academic Details
              </h2>

              <p className="mt-1 text-sm text-muted">
                Information currently stored in your placement profile.
              </p>
            </div>

            <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">

              <ProfileField
                label="Full Name"
                value={profile?.name}
              />

              <ProfileField
                label="Email Address"
                value={profile?.email}
              />

              <ProfileField
                label="Roll Number"
                value={profile?.rollNo}
              />

              <ProfileField
                label="Branch"
                value={profile?.branch}
              />

              <ProfileField
                label="CGPA"
                value={profile?.cgpa}
              />

              <ProfileField
                label="Backlogs"
                value={profile?.backlogs ?? 0}
              />

              <ProfileField
                label="Faculty Approval"
                value={
                  profile?.approved
                    ? 'Approved'
                    : 'Pending'
                }
              />

              <ProfileField
                label="Placement Status"
                value={
                  profile?.placed
                    ? 'Selected'
                    : 'Not Placed'
                }
              />

              <ProfileField
                label="Faculty Mentor"
                value={
                  profile?.mentor?.name ||
                  'Not Assigned'
                }
              />

            </div>

          </section>
        )}

        {/* Edit Profile */}
        {editing && (
          <form
            onSubmit={handleSubmit}
            className="modern-card p-6 sm:p-8"
          >

            <div className="mb-7">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Edit Profile
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                    Keep your academic information accurate so
                    job eligibility can be calculated correctly.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary hidden sm:inline-flex"
                >
                  Cancel
                </button>

              </div>

            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="name"
                  className="modern-label"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  className="modern-input"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="modern-label"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  className="modern-input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="rollNo"
                  className="modern-label"
                >
                  Roll Number
                </label>

                <input
                  id="rollNo"
                  name="rollNo"
                  type="text"
                  className="modern-input"
                  value={form.rollNo}
                  onChange={handleChange}
                  placeholder="Enter roll number"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="branch"
                  className="modern-label"
                >
                  Branch
                </label>

                <input
                  id="branch"
                  name="branch"
                  type="text"
                  className="modern-input"
                  value={form.branch}
                  onChange={handleChange}
                  placeholder="e.g. AI & ML"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="cgpa"
                  className="modern-label"
                >
                  CGPA
                </label>

                <input
                  id="cgpa"
                  name="cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  className="modern-input"
                  value={form.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 8.12"
                  required
                />

                <p className="mt-1 text-[11px] text-subtle">
                  Enter a value between 0 and 10.
                </p>
              </div>

              <div>
                <label
                  htmlFor="backlogs"
                  className="modern-label"
                >
                  Backlogs
                </label>

                <input
                  id="backlogs"
                  name="backlogs"
                  type="number"
                  min="0"
                  step="1"
                  className="modern-input"
                  value={form.backlogs}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

            </div>

            {/* Read-only fields */}
            <div className="mt-8 rounded-xl border border-border bg-surface-2 p-4">

              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                System-managed information
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">

                <div>
                  <p className="text-xs text-subtle">
                    Faculty Approval
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={
                        profile?.approved
                          ? 'Approved'
                          : 'Pending'
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-subtle">
                    Placement Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={
                        profile?.placed
                          ? 'Selected'
                          : 'Not Placed'
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-subtle">
                    Faculty Mentor
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white">
                    {profile?.mentor?.name ||
                      'Not Assigned'}
                  </p>
                </div>

              </div>

            </div>

            {/* Buttons */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary w-full sm:w-auto"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary w-full sm:w-auto"
                disabled={saving}
              >
                {saving
                  ? 'Saving Changes...'
                  : 'Save Changes'}
              </button>

            </div>

          </form>
        )}

      </div>
    </DashboardLayout>
  )
}

function ProfileField({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">

      <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-white">
        {value === undefined ||
        value === null ||
        value === ''
          ? '—'
          : value}
      </p>

    </div>
  )
}