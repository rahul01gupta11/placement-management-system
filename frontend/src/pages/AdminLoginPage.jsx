import { useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.jsx'
import { getErrorMessage } from '../services/api.js'

function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, role, loginAdmin } = useAuth()
  const [form, setForm] = useState({ adminId: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const from = location.state?.from

  if (isAuthenticated && role === 'admin') {
    return <Navigate to={from || '/admin/dashboard'} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await loginAdmin(form)
      navigate(from || '/admin/dashboard', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in as admin.'))
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100'

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-slate-200/70 bg-slate-950 p-8 text-white shadow-[0_30px_70px_rgba(15,23,42,0.2)]">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">Admin control room</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">Manage placements with secured backend access.</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            This panel uses JWT-protected admin routes for companies, students, applications, and placement analytics.
          </p>
          <div className="mt-8 space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">Protected operations</p>
              <p className="mt-2 text-sm text-slate-300">
                Delete actions and analytics load through admin-only backend endpoints.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">Existing schema</p>
              <p className="mt-2 text-sm text-slate-300">
                All screens reuse the current Student, Company, Application, and PlacementStats models.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel card-shadow rounded-[32px] border border-white/60 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">Admin login</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Sign in to the admin panel</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use the configured admin ID and password from the backend admin records or environment setup.
          </p>

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              className={inputClass}
              placeholder="Admin ID"
              value={form.adminId}
              onChange={(event) => setForm((current) => ({ ...current, adminId: event.target.value }))}
              required
            />
            <input
              className={inputClass}
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-200"
            >
              {loading ? 'Signing in...' : 'Sign in as admin'}
            </button>
          </form>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="inline-flex rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-200 hover:text-amber-700"
            >
              Student access
            </Link>
            <Link
              to="/"
              className="inline-flex rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-200 hover:text-amber-700"
            >
              Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
