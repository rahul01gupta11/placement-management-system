import { useCallback, useEffect, useMemo, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import SectionCard from '../components/SectionCard.jsx'
import StatCard from '../components/StatCard.jsx'
import DataTable from '../components/DataTable.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { adminSidebarItems } from '../utils/adminNavigation.js'
import {
  getAdminApplicationStats,
  getAdminApplications,
  getAdminCompanies,
  getAdminStats,
  getAdminStudents,
  getErrorMessage,
} from '../services/api.js'

function AdminDashboard() {
  const [companies, setCompanies] = useState([])
  const [students, setStudents] = useState([])
  const [applications, setApplications] = useState([])
  const [applicationStats, setApplicationStats] = useState(null)
  const [placementStats, setPlacementStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [companyData, studentData, applicationData, applicationSummary, placementSummary] =
        await Promise.all([
          getAdminCompanies(),
          getAdminStudents(),
          getAdminApplications(),
          getAdminApplicationStats(),
          getAdminStats(),
        ])

      setCompanies(companyData)
      setStudents(studentData)
      setApplications(applicationData)
      setApplicationStats(applicationSummary)
      setPlacementStats(placementSummary)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load the admin dashboard.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const recentApplications = useMemo(
    () =>
      applications.slice(0, 6).map((application) => ({
        id: application._id,
        student: application.student?.name?.join(' ') || application.roll_no,
        company: application.company?.name || application.company_id,
        status: application.status,
      })),
    [applications],
  )

  return (
    <AppShell
      title="Admin Dashboard"
      subtitle="Monitor the placement system, review current activity, and move into management pages from one secured admin workspace."
      roleLabel="Admin Panel"
      notice="All admin pages use JWT-protected backend APIs and the existing project data models."
      sidebarItems={adminSidebarItems}
    >
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Students"
          value={students.length}
          helper="Registered students"
          accent="bg-amber-100 text-amber-700"
        />
        <StatCard
          label="Companies"
          value={companies.length}
          helper="Active company records"
          accent="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          label="Applications"
          value={applicationStats?.totalApplications ?? applications.length}
          helper="Submitted applications"
          accent="bg-sky-100 text-sky-700"
        />
        <StatCard
          label="Placed"
          value={placementStats?.placedStudents ?? 0}
          helper="Students with final placements"
          accent="bg-violet-100 text-violet-700"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionCard
          title="Recent Applications"
          subtitle="Latest application activity across the platform."
          action={
            <button
              type="button"
              onClick={loadDashboard}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-200 hover:text-amber-700"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          }
        >
          <DataTable
            columns={[
              { key: 'student', label: 'Student' },
              { key: 'company', label: 'Company' },
              {
                key: 'status',
                label: 'Status',
                render: (value) => <StatusBadge value={value} />,
              },
            ]}
            rows={recentApplications}
            emptyMessage={loading ? 'Loading applications...' : 'No applications found.'}
          />
        </SectionCard>

        <SectionCard title="Quick Metrics" subtitle="A compact view of the current placement funnel.">
          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Placement rate</p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {placementStats?.totalStudents
                  ? `${Math.round((placementStats.placedStudents / placementStats.totalStudents) * 100)}%`
                  : '0%'}
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Highest package</p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {placementStats?.highestPackage ?? 'N/A'}
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Avg package</p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {placementStats?.averagePackage ?? 'N/A'}
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Status mix</p>
              <p className="mt-3 text-base text-slate-700">
                Applied {applicationStats?.statusCounts?.Applied ?? 0}, Shortlisted{' '}
                {applicationStats?.statusCounts?.Shortlisted ?? 0}, Rejected{' '}
                {applicationStats?.statusCounts?.Rejected ?? 0}
              </p>
            </div>
          </div>
        </SectionCard>
      </section>
    </AppShell>
  )
}

export default AdminDashboard
