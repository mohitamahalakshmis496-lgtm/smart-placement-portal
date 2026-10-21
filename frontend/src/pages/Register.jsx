import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { toFriendlyMessage } from '../api/errors'

const roles = [
  { value: 'student', label: 'Student' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'company', label: 'Company' },
  { value: 'admin', label: 'Admin' },
]

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rollNo: '',
    branch: '',
    cgpa: '',
    backlogs: 0,
    adminCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleRoleChange(newRole) {
    setRole(newRole)
    setError('')
    setSuccess('')
    setForm((current) => ({ ...current, adminCode: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      }

      if (role === 'student') {
        payload.rollNo = form.rollNo
        payload.branch = form.branch
        payload.cgpa = Number(form.cgpa)
        payload.backlogs = Number(form.backlogs || 0)
      }

      if (role === 'admin') {
        payload.adminCode = form.adminCode
      }

      await api.post('/auth/register', payload)

      const messages = {
        student: 'Registration successful. Your account is now waiting for Faculty approval.',
        faculty: 'Faculty account created successfully. You can now sign in.',
        company: 'Registration successful. Your company account is now waiting for Admin approval.',
        admin: 'Admin account created successfully. You can now sign in.',
      }

      setSuccess(messages[role])
      setForm({
        name: '', email: '', password: '', rollNo: '', branch: '',
        cgpa: '', backlogs: 0, adminCode: '',
      })
    } catch (err) {
      setError(toFriendlyMessage(err, 'Unable to create your account. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const nameLabel = role === 'company' ? 'Company Name' : 'Full Name'

  return (
    <main className="min-h-screen bg-app flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary font-bold text-white">S</div>
          <p className="text-sm font-semibold text-teal-400">Smart Placement</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">Join the Smart Placement Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="modern-card p-6 sm:p-8">
          {error && <div className="mb-5 rounded-xl border border-rust-600/30 bg-rust-600/10 px-4 py-3 text-sm text-rust-400">{error}</div>}
          {success && <div className="mb-5 rounded-xl border border-teal-500/20 bg-teal-500/10 px-4 py-3 text-sm text-teal-400">{success}</div>}

          <div className="mb-6">
            <label className="modern-label">Account Type</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {roles.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleRoleChange(item.value)}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${role === item.value ? 'border-teal-400 bg-teal-400/10 text-teal-400' : 'border-border bg-surface-2 text-slate-400'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="name" className="modern-label">{nameLabel}</label>
            <input id="name" name="name" type="text" required className="modern-input" value={form.name} onChange={handleChange} placeholder={role === 'company' ? 'Enter company name' : 'Enter your full name'} />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="modern-label">Email Address</label>
            <input id="email" name="email" type="email" required className="modern-input" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="modern-label">Password</label>
            <input id="password" name="password" type="password" required minLength={6} className="modern-input" value={form.password} onChange={handleChange} placeholder="Create a password" />
          </div>

          {role === 'student' && (
            <div className="space-y-5">
              <div>
                <label htmlFor="rollNo" className="modern-label">Roll Number</label>
                <input id="rollNo" name="rollNo" type="text" required className="modern-input" value={form.rollNo} onChange={handleChange} placeholder="Enter roll number" />
              </div>
              <div>
                <label htmlFor="branch" className="modern-label">Branch</label>
                <input id="branch" name="branch" type="text" required className="modern-input" value={form.branch} onChange={handleChange} placeholder="e.g. AI & ML" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cgpa" className="modern-label">CGPA</label>
                  <input id="cgpa" name="cgpa" type="number" step="0.01" min="0" max="10" required className="modern-input" value={form.cgpa} onChange={handleChange} placeholder="8.12" />
                </div>
                <div>
                  <label htmlFor="backlogs" className="modern-label">Backlogs</label>
                  <input id="backlogs" name="backlogs" type="number" min="0" className="modern-input" value={form.backlogs} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {role === 'admin' && (
            <div className="mt-5">
              <label htmlFor="adminCode" className="modern-label">Admin Registration Code</label>
              <input id="adminCode" name="adminCode" type="password" required className="modern-input" value={form.adminCode} onChange={handleChange} placeholder="Enter admin registration code" />
              <p className="mt-2 text-xs text-slate-500">This code is configured by the system administrator.</p>
            </div>
          )}

          {role === 'faculty' && (
            <div className="mt-5 rounded-xl border border-teal-500/20 bg-teal-500/5 px-4 py-3 text-xs leading-5 text-slate-400">
              Faculty accounts are activated immediately and can sign in after registration.
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary mt-7 w-full py-3">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <button type="button" onClick={() => navigate('/')} className="font-semibold text-teal-400 hover:text-teal-300">Sign in</button>
        </p>
      </div>
    </main>
  )
}
