import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel card-shadow max-w-lg rounded-[32px] border border-white/60 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-700">404</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          The route you requested does not exist in this frontend application.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
