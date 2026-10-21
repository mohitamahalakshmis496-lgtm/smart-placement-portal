import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { setSession, roleHomePath } from '../api/auth'
import { toFriendlyMessage } from '../api/errors'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', {
        email,
        password,
      })

      setSession(data.token, data.user)

      navigate(
        roleHomePath(data.user.role),
        { replace: true }
      )
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          'Incorrect email or password.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-app">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="relative hidden overflow-hidden bg-surface p-12 lg:flex lg:flex-col lg:justify-between">

          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary font-bold text-white">
              S
            </div>

            <div>
              <p className="font-bold text-white">
                Smart Placement
              </p>

              <p className="text-[11px] text-slate-500">
                Career Intelligence Platform
              </p>
            </div>
          </div>

          <div className="relative max-w-xl">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-400">
              Your career. Smarter.
            </p>

            <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight text-white">
              One platform for your entire placement journey.
            </h1>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Discover opportunities, track applications and
              make better career decisions through intelligent
              placement insights.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Feature label="Jobs" />
              <Feature label="Applications" />
              <Feature label="Smart Insights" />
            </div>

          </div>

          <p className="relative text-xs text-slate-600">
            Smart Placement Portal • 2026
          </p>

        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-8">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="mb-8 lg:hidden">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary font-bold text-white">
                  S
                </div>

                <div>
                  <p className="font-bold text-white">
                    Smart Placement
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Career Intelligence Platform
                  </p>
                </div>

              </div>

            </div>

            {/* HEADER */}
            <div className="mb-8">

              <p className="text-sm font-semibold text-teal-400">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Access your personalized placement workspace.
              </p>

            </div>

            {/* LOGIN FORM */}
            <form
              onSubmit={submit}
              className="modern-card p-6 sm:p-8"
            >

              {error && (
                <div className="mb-5 rounded-xl border border-rust-600/30 bg-rust-600/10 px-4 py-3 text-sm text-rust-400">
                  {error}
                </div>
              )}

              <div className="space-y-5">

                {/* EMAIL */}
                <div>

                  <label
                    className="modern-label"
                    htmlFor="email"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    className="modern-input"
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                  />

                </div>

                {/* PASSWORD */}
                <div>

                  <label
                    className="modern-label"
                    htmlFor="password"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    className="modern-input"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                  />

                </div>

                {/* SIGN IN */}
                <button
                  type="submit"
                  className="btn-primary w-full py-3"
                  disabled={loading}
                >
                  {loading
                    ? 'Signing in…'
                    : 'Sign in'}
                </button>

              </div>

            </form>

            {/* REGISTER LINK */}
            <p className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{' '}

              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-semibold text-teal-400 hover:text-teal-300"
              >
                Create an account
              </button>
            </p>

            {/* FOOTER */}
            <p className="mt-4 text-center text-xs text-slate-600">
              Secure role-based access for students, faculty,
              companies and administrators.
            </p>

          </div>

        </section>

      </div>
    </main>
  )
}

function Feature({ label }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">

      <div className="mb-2 h-1.5 w-7 rounded-full bg-primary" />

      <p className="text-xs font-semibold text-slate-300">
        {label}
      </p>

    </div>
  )
}