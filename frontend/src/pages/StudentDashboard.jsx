import { useCallback, useEffect, useMemo, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import DataTable from '../components/DataTable.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SectionCard from '../components/SectionCard.jsx'
import StatCard from '../components/StatCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useAuth } from '../context/useAuth.jsx'
import {
  applyToCompany,
  getApplications,
  getCompanies,
  getErrorMessage,
  getPlacements,
  getStages,
} from '../services/api.js'

function StudentDashboard() {
  const { user } = useAuth()
  const [companies, setCompanies] = useState([])
  const [applications, setApplications] = useState([])
  const [stages, setStages] = useState([])
  const [placements, setPlacements] = useState([])
  const [loading, setLoading] = useState(true)
  const [submittingCompanyId, setSubmittingCompanyId] = useState('')
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [companyData, applicationData, stageData, placementData] = await Promise.all([
        getCompanies(),
        getApplications(),
        getStages(),
        getPlacements(),
      ])

      setCompanies(companyData)
      setApplications(applicationData)
      setStages(stageData)
      setPlacements(placementData)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load student dashboard data.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const myApplications = useMemo(
    () => applications.filter((item) => item.roll_no === user.roll_no),
    [applications, user.roll_no],
  )

  const myApplicationMap = useMemo(
    () => new Map(myApplications.map((item) => [item.company_id, item])),
    [myApplications],
  )

  const myStages = useMemo(
    () => stages.filter((item) => item.roll_no === user.roll_no),
    [stages, user.roll_no],
  )

  const myPlacement = useMemo(
    () => placements.find((item) => item.roll_no === user.roll_no),
    [placements, user.roll_no],
  )

  const handleApply = async (companyId) => {
    setSubmittingCompanyId(companyId)
    setError('')
    setFeedback('')

    try {
      const response = await applyToCompany({
        roll_no: user.roll_no,
        company_id: companyId,
      })

      if (response?.message) {
        setFeedback(response.message)
      } else {
        setFeedback('Application submitted successfully.')
      }

      await loadDashboard()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to submit application.'))
    } finally {
      setSubmittingCompanyId('')
    }
  }

  const applicationRows = myApplications.map((application) => {
    const company = companies.find((item) => item.company_id === application.company_id)
    const stageCount = myStages.filter((item) => item.company_id === application.company_id).length

    return {
      id: application._id || `${application.roll_no}-${application.company_id}`,
      company: company?.name || application.company_id,
      location: company?.location || '-',
      package: company?.ctc_stipend ? `${company.ctc_stipend} LPA/Stipend` : '-',
      status: application.status,
      stages: stageCount,
    }
  })

  const stageRows = myStages.map((stage, index) => {
    const company = companies.find((item) => item.company_id === stage.company_id)

    return {
      id: stage._id || `${stage.company_id}-${stage.stage_name}-${index}`,
      company: company?.name || stage.company_id,
      stage_name: stage.stage_name,
      status: stage.status,
    }
  })

  return (
    <AppShell
      title="Student Dashboard"
      subtitle="Review live company listings, apply with the backend application API, and monitor your application and stage progress."
      roleLabel="Student Portal"
      notice="Student login is matched against the existing student collection because the backend has no dedicated auth route."
      sidebarItems={[
        { to: '#overview', label: 'Overview' },
        { to: '#companies', label: 'Companies' },
        { to: '#applications', label: 'Applications' },
        { to: '#stages', label: 'Stages' },
      ]}
    >
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      {feedback ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {feedback}
        </div>
      ) : null}

      <section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Applications"
          value={myApplications.length}
          helper="Applications submitted through /api/applications/apply."
          accent="bg-blue-100 text-blue-700"
        />
        <StatCard
          label="Shortlisted"
          value={myApplications.filter((item) => item.status === 'Shortlisted').length}
          helper="Live count from backend application status."
          accent="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          label="Stages"
          value={myStages.length}
          helper="Selection stage updates from /api/stages."
          accent="bg-amber-100 text-amber-700"
        />
        <StatCard
          label="Placement"
          value={myPlacement ? myPlacement.company || 'Placed' : 'Pending'}
          helper="Final placement data from /api/placements."
          accent="bg-violet-100 text-violet-700"
        />
      </section>

      <SectionCard
        id="companies"
        title="Open Companies"
        subtitle="These records come directly from GET /api/companies."
        action={
          <button
            type="button"
            onClick={loadDashboard}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            Refresh
          </button>
        }
      >
        {loading ? (
          <p className="text-sm text-slate-500">Loading companies...</p>
        ) : companies.length === 0 ? (
          <EmptyState
            title="No companies yet"
            message="Admin needs to add company records before students can apply."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => {
              const existingApplication = myApplicationMap.get(company.company_id)

              return (
                <article
                  key={company._id || company.company_id}
                  className="rounded-[26px] border border-slate-200 bg-slate-50 p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
                        {company.company_id}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-slate-900">{company.name}</h3>
                    </div>
                    {existingApplication ? <StatusBadge value={existingApplication.status} /> : null}
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Location: {company.location}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Package/Stipend: <span className="font-semibold text-slate-900">{company.ctc_stipend}</span>
                  </p>
                  <button
                    type="button"
                    disabled={Boolean(existingApplication) || submittingCompanyId === company.company_id}
                    onClick={() => handleApply(company.company_id)}
                    className="mt-5 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {submittingCompanyId === company.company_id
                      ? 'Submitting...'
                      : existingApplication
                        ? 'Already applied'
                        : 'Apply now'}
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        id="applications"
        title="My Applications"
        subtitle="Status values are read from GET /api/applications and filtered by your roll number."
      >
        <DataTable
          columns={[
            { key: 'company', label: 'Company' },
            { key: 'location', label: 'Location' },
            { key: 'package', label: 'CTC/Stipend' },
            {
              key: 'status',
              label: 'Status',
              render: (value) => <StatusBadge value={value} />,
            },
            { key: 'stages', label: 'Stages cleared' },
          ]}
          rows={applicationRows}
          emptyMessage="No applications submitted yet."
        />
      </SectionCard>

      <SectionCard
        id="stages"
        title="Selection Stages"
        subtitle="Stage records come from the existing selection stage API."
      >
        <DataTable
          columns={[
            { key: 'company', label: 'Company' },
            { key: 'stage_name', label: 'Stage' },
            {
              key: 'status',
              label: 'Result',
              render: (value) => <StatusBadge value={value} />,
            },
          ]}
          rows={stageRows}
          emptyMessage="No stage updates available yet."
        />
      </SectionCard>
    </AppShell>
  )
}

export default StudentDashboard
