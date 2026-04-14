import { useCallback, useEffect, useMemo, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import DataTable from '../components/DataTable.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SectionCard from '../components/SectionCard.jsx'
import StatCard from '../components/StatCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useAuth } from '../context/useAuth.jsx'
import {
  createCompany,
  getApplications,
  getCompanies,
  getErrorMessage,
  getPlacements,
  getStudents,
} from '../services/api.js'

const initialCompanyForm = {
  company_id: '',
  name: '',
  location: '',
  ctc_stipend: '',
}

function AdminDashboard() {
  const { meta } = useAuth()
  const [students, setStudents] = useState([])
  const [companies, setCompanies] = useState([])
  const [applications, setApplications] = useState([])
  const [placements, setPlacements] = useState([])
  const [companyForm, setCompanyForm] = useState(initialCompanyForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const loadAdminDashboard = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [studentData, companyData, applicationData, placementData] = await Promise.all([
        getStudents(),
        getCompanies(),
        getApplications(),
        getPlacements(),
      ])

      setStudents(studentData)
      setCompanies(companyData)
      setApplications(applicationData)
      setPlacements(placementData)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load admin dashboard data.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAdminDashboard()
  }, [loadAdminDashboard])

  const applicationRows = useMemo(
    () =>
      applications.map((application) => {
        const student = students.find((item) => item.roll_no === application.roll_no)
        const company = companies.find((item) => item.company_id === application.company_id)

        return {
          id: application._id || `${application.roll_no}-${application.company_id}`,
          student: student?.name?.join(' ') || application.roll_no,
          roll_no: application.roll_no,
          company: company?.name || application.company_id,
          status: application.status,
        }
      }),
    [applications, companies, students],
  )

  const studentRows = useMemo(
    () =>
      students.map((student) => ({
        id: student._id || student.roll_no,
        roll_no: student.roll_no,
        name: student.name.join(' '),
        cgpa: student.cgpa,
        branch: student.branch,
      })),
    [students],
  )

  const companyRows = useMemo(
    () =>
      companies.map((company) => ({
        id: company._id || company.company_id,
        company_id: company.company_id,
        name: company.name,
        location: company.location,
        ctc_stipend: company.ctc_stipend,
      })),
    [companies],
  )

  const handleCompanySubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setFeedback('')

    try {
      await createCompany(companyForm)
      setFeedback('Company added successfully.')
      setCompanyForm(initialCompanyForm)
      await loadAdminDashboard()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to add company.'))
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100'

  return (
    <AppShell
      title="Admin Dashboard"
      subtitle="Manage company records and review students and applications using the routes already implemented in the backend."
      roleLabel="Admin Portal"
      notice="Admin login is frontend-only because no admin auth API exists in the backend. All data views and company creation use real backend routes."
      sidebarItems={[
        { to: '#overview', label: 'Overview' },
        { to: '#add-company', label: 'Add Company' },
        { to: '#students', label: 'Students' },
        { to: '#applications', label: 'Applications' },
      ]}
    >
      {meta?.isFrontendOnly ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Admin authentication is not backed by a server route in this project. Data operations below are
          still connected to the existing backend APIs.
        </div>
      ) : null}
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
          label="Students"
          value={students.length}
          helper="Student records from /api/students."
          accent="bg-blue-100 text-blue-700"
        />
        <StatCard
          label="Companies"
          value={companies.length}
          helper="Company listings from /api/companies."
          accent="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          label="Applications"
          value={applications.length}
          helper="Submitted applications from /api/applications."
          accent="bg-amber-100 text-amber-700"
        />
        <StatCard
          label="Placements"
          value={placements.length}
          helper="Final placement entries from /api/placements."
          accent="bg-violet-100 text-violet-700"
        />
      </section>

      <SectionCard
        id="add-company"
        title="Add Company"
        subtitle="Creates a company using POST /api/companies."
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCompanySubmit}>
          <input
            className={inputClass}
            placeholder="Company ID"
            value={companyForm.company_id}
            onChange={(event) =>
              setCompanyForm((current) => ({ ...current, company_id: event.target.value }))
            }
            required
          />
          <input
            className={inputClass}
            placeholder="Company name"
            value={companyForm.name}
            onChange={(event) =>
              setCompanyForm((current) => ({ ...current, name: event.target.value }))
            }
            required
          />
          <input
            className={inputClass}
            placeholder="Location"
            value={companyForm.location}
            onChange={(event) =>
              setCompanyForm((current) => ({ ...current, location: event.target.value }))
            }
            required
          />
          <input
            className={inputClass}
            placeholder="CTC / Stipend"
            type="number"
            min="0"
            step="0.01"
            value={companyForm.ctc_stipend}
            onChange={(event) =>
              setCompanyForm((current) => ({ ...current, ctc_stipend: event.target.value }))
            }
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitting ? 'Adding company...' : 'Add company'}
          </button>
        </form>
      </SectionCard>

      <SectionCard
        id="students"
        title="Students"
        subtitle="Student records come directly from the existing student API."
        action={
          <button
            type="button"
            onClick={loadAdminDashboard}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        }
      >
        {students.length === 0 && !loading ? (
          <EmptyState title="No students found" message="Register at least one student to populate this table." />
        ) : (
          <DataTable
            columns={[
              { key: 'roll_no', label: 'Roll No' },
              { key: 'name', label: 'Name' },
              { key: 'cgpa', label: 'CGPA' },
              { key: 'branch', label: 'Branch' },
            ]}
            rows={studentRows}
            emptyMessage="Loading student records..."
          />
        )}
      </SectionCard>

      <SectionCard title="Applications" subtitle="Applications joined in the frontend with student and company data.">
        <DataTable
          columns={[
            { key: 'student', label: 'Student' },
            { key: 'roll_no', label: 'Roll No' },
            { key: 'company', label: 'Company' },
            {
              key: 'status',
              label: 'Status',
              render: (value) => <StatusBadge value={value} />,
            },
          ]}
          rows={applicationRows}
          emptyMessage="No applications found."
        />
      </SectionCard>

      <SectionCard title="Companies" subtitle="Current company records available for student applications.">
        <DataTable
          columns={[
            { key: 'company_id', label: 'Company ID' },
            { key: 'name', label: 'Name' },
            { key: 'location', label: 'Location' },
            { key: 'ctc_stipend', label: 'CTC/Stipend' },
          ]}
          rows={companyRows}
          emptyMessage="No company records found."
        />
      </SectionCard>
    </AppShell>
  )
}

export default AdminDashboard
