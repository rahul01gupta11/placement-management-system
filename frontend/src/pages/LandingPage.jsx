import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.jsx'

function FeatureCard({ title, description }) {
  return (
    <div className="rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  )
}

function LandingPage() {
  const { isAuthenticated, role } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={role === 'student' ? '/student' : '/admin'} replace />
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="glass-panel card-shadow overflow-hidden rounded-[36px] border border-white/60 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-700">
                NSUT Placement Cell
              </p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Placement workflows in one simple portal.
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                This frontend is connected to the existing Express and MongoDB backend. Students can
                register, explore companies, and apply. Admin users can add companies and monitor the
                current student and application data.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/auth"
                  className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Open portal
                </Link>
                <a
                  href="#features"
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                >
                  View features
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:w-[420px]">
              <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Backend routes</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  <li>/api/students</li>
                  <li>/api/companies</li>
                  <li>/api/applications</li>
                  <li>/api/stages</li>
                  <li>/api/placements</li>
                </ul>
              </div>
              <div className="rounded-[28px] border border-blue-100 bg-blue-50 p-6 shadow-lg">
                <p className="text-sm uppercase tracking-[0.3em] text-blue-700">Project note</p>
                <p className="mt-4 text-sm leading-6 text-blue-900">
                  The backend does not expose dedicated auth endpoints, so student sign-in is matched
                  against stored student records and admin access is frontend-gated.
                </p>
              </div>
            </div>
          </div>
        </header>

        <section id="features" className="mt-8 grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="Student dashboard"
            description="Browse company openings, submit applications through the existing apply endpoint, and track current status and stage progress."
          />
          <FeatureCard
            title="Admin dashboard"
            description="Add company entries with the backend company API, inspect students, and review consolidated application records."
          />
          <FeatureCard
            title="Responsive UI"
            description="Built with React Router, Axios, and Tailwind CSS using a responsive card-and-table layout for laptop and mobile screens."
          />
        </section>
      </div>
    </div>
  )
}

export default LandingPage
