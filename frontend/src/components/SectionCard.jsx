function SectionCard({ id, title, subtitle, action, children }) {
  return (
    <section
      id={id}
      className="rounded-[28px] border border-slate-200/70 bg-white/95 p-6 shadow-sm transition duration-200 hover:shadow-lg"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  )
}

export default SectionCard
