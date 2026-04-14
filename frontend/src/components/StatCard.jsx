function StatCard({ label, value, accent, helper }) {
  return (
    <div className="group rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${accent}`}
      >
        {label}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </div>
  )
}

export default StatCard
