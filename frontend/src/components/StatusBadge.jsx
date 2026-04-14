const STATUS_STYLES = {
  Applied: 'bg-amber-100 text-amber-800',
  Shortlisted: 'bg-emerald-100 text-emerald-800',
  Rejected: 'bg-rose-100 text-rose-800',
  Cleared: 'bg-emerald-100 text-emerald-800',
  Failed: 'bg-rose-100 text-rose-800',
}

function StatusBadge({ value }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        STATUS_STYLES[value] || 'bg-slate-100 text-slate-700'
      }`}
    >
      {value}
    </span>
  )
}

export default StatusBadge
