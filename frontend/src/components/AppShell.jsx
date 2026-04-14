import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth.jsx'

function SidebarLink({ to, label }) {
  return (
    <a
      href={to}
      className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-slate-900"
    >
      {label}
    </a>
  )
}

function AppShell({ title, subtitle, roleLabel, notice, sidebarItems, children }) {
  const { logout, role, user } = useAuth()
  const dashboardPath = role === 'student' ? '/student' : '/admin'
  const displayName = Array.isArray(user?.name) ? user.name.join(' ') : user?.name || 'Portal User'

  return (
    <div className="min-h-screen bg-transparent px-4 py-4 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/40 shadow-[0_35px_90px_rgba(15,23,42,0.14)] backdrop-blur">
        <header className="border-b border-slate-200/80 bg-white/70 px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <NavLink to="/" className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                Placement Management System
              </NavLink>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">{subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                <p className="font-semibold">{displayName}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-700">{roleLabel}</p>
              </div>
              <NavLink
                to={dashboardPath}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
              >
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="grid flex-1 gap-0 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="border-b border-slate-200/80 bg-slate-950 px-6 py-6 text-slate-100 lg:border-b-0 lg:border-r">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Workspace</p>
              <p className="mt-3 text-lg font-semibold text-white">{roleLabel}</p>
              <p className="mt-2 text-sm text-slate-300">{notice}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {sidebarItems.map((item) => (
                <SidebarLink key={item.to} {...item} />
              ))}
            </div>
          </aside>

          <main className="overflow-y-auto px-6 py-6 sm:px-8">
            <div className="space-y-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppShell
