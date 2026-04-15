import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.jsx'
import { getErrorMessage } from '../services/api.js'

const initialRegisterForm = {
  roll_no: '',
  full_name: '',
  cgpa: '',
  branch: '',
}

const initialLoginForm = {
  rollNo: '',
  fullName: '',
}

function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginStudent, registerStudent } = useAuth()
  const [activeTab, setActiveTab] = useState('student-login')
  const [loginForm, setLoginForm] = useState(initialLoginForm)
  const [registerForm, setRegisterForm] = useState(initialRegisterForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const from = location.state?.from

  const redirectAfterStudent = () => navigate(from || '/student', { replace: true })

  const handleStudentLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await loginStudent(loginForm)
      redirectAfterStudent()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in.'))
    } finally {
      setLoading(false)
    }
  }

  const handleStudentRegister = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await registerStudent({
        roll_no: registerForm.roll_no.trim(),
        name: registerForm.full_name
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        cgpa: registerForm.cgpa,
        branch: registerForm.branch.trim(),
      })

      redirectAfterStudent()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to register student.'))
    } finally {
      setLoading(false)
    }
  }

  const sharedInputClass =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100'

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel card-shadow rounded-[32px] border border-white/60 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">Student access</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
            Placement workflows for students, with backend-backed registration.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Sign in with an existing student record or register a new one using the current backend schema.
            Admin access now has its own secured login page.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ['student-login', 'Student Login'],
              ['student-register', 'Student Register'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setActiveTab(value)
                  setError('')
                }}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  activeTab === value
                    ? 'bg-slate-950 text-white shadow-lg'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-amber-200 hover:text-amber-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {activeTab === 'student-login' ? (
            <form className="mt-6 space-y-4" onSubmit={handleStudentLogin}>
              <input
                className={sharedInputClass}
                placeholder="Roll number"
                value={loginForm.rollNo}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, rollNo: event.target.value }))
                }
                required
              />
              <input
                className={sharedInputClass}
                placeholder="Full name"
                value={loginForm.fullName}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, fullName: event.target.value }))
                }
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300"
              >
                {loading ? 'Signing in...' : 'Sign in as student'}
              </button>
            </form>
          ) : null}

          {activeTab === 'student-register' ? (
            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleStudentRegister}>
              <input
                className={sharedInputClass}
                placeholder="Roll number"
                value={registerForm.roll_no}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, roll_no: event.target.value }))
                }
                required
              />
              <input
                className={sharedInputClass}
                placeholder="Branch"
                value={registerForm.branch}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, branch: event.target.value }))
                }
                required
              />
              <input
                className="sm:col-span-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                placeholder="Full name"
                value={registerForm.full_name}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, full_name: event.target.value }))
                }
                required
              />
              <input
                className={sharedInputClass}
                placeholder="CGPA"
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={registerForm.cgpa}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, cgpa: event.target.value }))
                }
                required
              />
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Names are stored using the existing array-based student schema and converted automatically.
              </div>
              <button
                type="submit"
                disabled={loading}
                className="sm:col-span-2 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? 'Creating account...' : 'Register student'}
              </button>
            </form>
          ) : null}
        </div>

        <div className="rounded-[32px] border border-slate-200/70 bg-slate-950 p-8 text-white shadow-[0_30px_70px_rgba(15,23,42,0.2)]">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">Portal routes</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">Student authentication</p>
              <p className="mt-2 text-sm text-slate-300">
                Student access still uses the current record-matching flow built on top of the existing student API.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">Admin authentication</p>
              <p className="mt-2 text-sm text-slate-300">
                Admin access now lives behind the secured backend endpoint at /api/admin/login.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">Placement data</p>
              <p className="mt-2 text-sm text-slate-300">
                Companies, applications, stages, placements, and admin stats stay connected to the same backend data model.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/admin/login"
              className="inline-flex rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              Admin login
            </Link>
            <Link
              to="/"
              className="inline-flex rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
