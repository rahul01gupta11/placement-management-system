import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import AppShell from '../components/AppShell.jsx'
import DataTable from '../components/DataTable.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SectionCard from '../components/SectionCard.jsx'
import StatCard from '../components/StatCard.jsx'
import { adminSidebarItems } from '../utils/adminNavigation.js'
import { getAdminStats, getErrorMessage } from '../services/api.js'

const branchColors = ['#f59e0b', '#0f766e', '#2563eb', '#7c3aed', '#dc2626', '#0891b2']

function AdminStatsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadStats = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getAdminStats()
      setStats(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load placement statistics.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const companyData = useMemo(
    () =>
      Object.entries(stats?.companyWisePlacements || {}).map(([company, count]) => ({
        company,
        count,
      })),
    [stats],
  )

  const branchData = useMemo(
    () =>
      Object.entries(stats?.branchWiseDistribution || {}).map(([branch, value], index) => ({
        branch,
        value,
        fill: branchColors[index % branchColors.length],
      })),
    [stats],
  )

  return (
    <AppShell
      title="Placement Stats"
      subtitle="Track placement performance with company-wise and branch-wise analytics built from the existing backend data."
      roleLabel="Admin Panel"
      notice="Highest and average package values are only shown when placement rows include the existing ctc field."
      sidebarItems={adminSidebarItems}
    >
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={stats?.totalStudents ?? 0} helper="All student records" accent="bg-amber-100 text-amber-700" />
        <StatCard label="Placed" value={stats?.placedStudents ?? 0} helper="Students with placements" accent="bg-emerald-100 text-emerald-700" />
        <StatCard label="Unplaced" value={stats?.unplacedStudents ?? 0} helper="Students still in pipeline" accent="bg-sky-100 text-sky-700" />
        <StatCard label="Highest CTC" value={stats?.highestPackage ?? 'N/A'} helper="Maximum recorded package" accent="bg-violet-100 text-violet-700" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Company-wise Placements"
          subtitle="Placement counts grouped by company name."
          action={
            <button
              type="button"
              onClick={loadStats}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-200 hover:text-amber-700"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          }
        >
          {companyData.length === 0 ? (
            <EmptyState title="No placement data" message="Company-wise counts will appear after final placements are recorded." />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyData} margin={{ top: 12, right: 12, left: 0, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="company" angle={-20} textAnchor="end" height={60} tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Branch Distribution" subtitle="Student distribution across branches.">
          {branchData.length === 0 ? (
            <EmptyState title="No branch data" message="Branch analytics will appear once student records exist." />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={branchData} dataKey="value" nameKey="branch" innerRadius={64} outerRadius={110} paddingAngle={3}>
                    {branchData.map((entry) => (
                      <Cell key={entry.branch} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {branchData.map((entry) => (
              <div key={entry.branch} className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                {entry.branch}
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <SectionCard title="Placed Students" subtitle={`Average package: ${stats?.averagePackage ?? 'N/A'}`}>
        {stats?.placedStudentsList?.length ? (
          <DataTable
            columns={[
              { key: 'roll_no', label: 'Roll No' },
              { key: 'name', label: 'Name' },
              { key: 'company', label: 'Company' },
              { key: 'location', label: 'Location' },
              { key: 'role', label: 'Role' },
              { key: 'ctc', label: 'CTC' },
            ]}
            rows={stats.placedStudentsList}
            emptyMessage="No placed students found."
          />
        ) : (
          <EmptyState title="No placements found" message="Placed students will appear once final placement rows are available." />
        )}
      </SectionCard>
    </AppShell>
  )
}

export default AdminStatsPage
