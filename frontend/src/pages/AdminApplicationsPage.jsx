import { useCallback, useEffect, useMemo, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import DataTable from '../components/DataTable.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SectionCard from '../components/SectionCard.jsx'
import StatCard from '../components/StatCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { adminSidebarItems } from '../utils/adminNavigation.js'
import {
  deleteAdminApplication,
  getAdminApplicationStats,
  getAdminApplications,
  getErrorMessage,
} from '../services/api.js'

function AdminApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState('')
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const loadApplications = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [applicationData, statsData] = await Promise.all([
        getAdminApplications(),
        getAdminApplicationStats(),
      ])

      setApplications(applicationData)
      setStats(statsData)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load applications.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  const rows = useMemo(
    () =>
      applications.map((application) => ({
        ...application,
        studentName: application.student?.name?.join(' ') || application.roll_no,
        companyName: application.company?.name || application.company_id,
      })),
    [applications],
  )

  const handleDelete = async (application) => {
    const confirmed = window.confirm(
      `Delete application for ${application.studentName} at ${application.companyName}?`,
    )

    if (!confirmed) {
      return
    }

    setActionId(application._id)
    setError('')
    setFeedback('')

    try {
      await deleteAdminApplication(application._id)
      setFeedback('Application deleted successfully.')
      await loadApplications()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete application.'))
    } finally {
      setActionId('')
    }
  }

  return (
    <AppShell
      title="Applications"
      subtitle="Track application flow, review student-company combinations, and remove application records when required."
      roleLabel="Admin Panel"
      notice="Application analytics are calculated from the existing application, company, and student collections."
      sidebarItems={adminSidebarItems}
    >
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}
      {feedback ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Applications"
          value={stats?.totalApplications ?? applications.length}
          helper="Total active application rows"
          accent="bg-sky-100 text-sky-700"
        />
        <StatCard
          label="Students"
          value={stats?.uniqueStudents ?? 0}
          helper="Students with at least one application"
          accent="bg-amber-100 text-amber-700"
        />
        <StatCard
          label="Companies"
          value={stats?.uniqueCompanies ?? 0}
          helper="Companies with applicant traffic"
          accent="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          label="Shortlisted"
          value={stats?.statusCounts?.Shortlisted ?? 0}
          helper="Applications currently shortlisted"
          accent="bg-violet-100 text-violet-700"
        />
      </section>

      <SectionCard
        title="Application Records"
        subtitle="Joined student and company data rendered from the admin application API."
        action={
          <button
            type="button"
            onClick={loadApplications}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-200 hover:text-amber-700"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        }
      >
        {applications.length === 0 && !loading ? (
          <EmptyState title="No applications found" message="Applications will appear once students start applying to companies." />
        ) : (
          <DataTable
            columns={[
              { key: 'studentName', label: 'Student' },
              { key: 'roll_no', label: 'Roll No' },
              { key: 'companyName', label: 'Company' },
              {
                key: 'status',
                label: 'Status',
                render: (value) => <StatusBadge value={value} />,
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (_, row) => (
                  <button
                    type="button"
                    onClick={() => handleDelete(row)}
                    disabled={actionId === row._id}
                    className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300"
                  >
                    {actionId === row._id ? 'Deleting...' : 'Delete'}
                  </button>
                ),
              },
            ]}
            rows={rows}
            emptyMessage={loading ? 'Loading applications...' : 'No applications found.'}
          />
        )}
      </SectionCard>
    </AppShell>
  )
}

export default AdminApplicationsPage
