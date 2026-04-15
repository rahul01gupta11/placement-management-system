import { useCallback, useEffect, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import DataTable from '../components/DataTable.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SectionCard from '../components/SectionCard.jsx'
import { adminSidebarItems } from '../utils/adminNavigation.js'
import {
  createCompany,
  deleteAdminCompany,
  getAdminCompanies,
  getAdminCompanyById,
  getErrorMessage,
} from '../services/api.js'

const initialCompanyForm = {
  company_id: '',
  name: '',
  location: '',
  ctc_stipend: '',
}

function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [companyForm, setCompanyForm] = useState(initialCompanyForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [actionId, setActionId] = useState('')
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const loadCompanies = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getAdminCompanies()
      setCompanies(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load companies.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCompanies()
  }, [loadCompanies])

  const handleCreateCompany = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setFeedback('')

    try {
      const createdCompany = await createCompany(companyForm)
      setFeedback('Company added successfully.')
      setCompanyForm(initialCompanyForm)
      setSelectedCompany(createdCompany)
      await loadCompanies()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create company.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleView = async (id) => {
    setError('')
    setFeedback('')

    try {
      const data = await getAdminCompanyById(id)
      setSelectedCompany(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load company details.'))
    }
  }

  const handleDelete = async (company) => {
    const confirmed = window.confirm(`Delete ${company.name} and its related application data?`)

    if (!confirmed) {
      return
    }

    setActionId(company._id)
    setError('')
    setFeedback('')

    try {
      await deleteAdminCompany(company._id)
      setFeedback('Company deleted successfully.')
      if (selectedCompany?._id === company._id) {
        setSelectedCompany(null)
      }
      await loadCompanies()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete company.'))
    } finally {
      setActionId('')
    }
  }

  return (
    <AppShell
      title="Companies"
      subtitle="Review company records, inspect a single company, and remove entries when needed."
      roleLabel="Admin Panel"
      notice="Deleting a company also removes related applications, selection stages, and matching placement rows."
      sidebarItems={adminSidebarItems}
    >
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}
      {feedback ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</div>
      ) : null}

      <SectionCard title="Add Company" subtitle="Create a new company record from the admin panel.">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreateCompany}>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="Company ID"
            value={companyForm.company_id}
            onChange={(event) =>
              setCompanyForm((current) => ({ ...current, company_id: event.target.value }))
            }
            required
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="Company name"
            value={companyForm.name}
            onChange={(event) =>
              setCompanyForm((current) => ({ ...current, name: event.target.value }))
            }
            required
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="Location"
            value={companyForm.location}
            onChange={(event) =>
              setCompanyForm((current) => ({ ...current, location: event.target.value }))
            }
            required
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
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

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Company Directory"
          subtitle="All company records currently available to students."
          action={
            <button
              type="button"
              onClick={loadCompanies}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-200 hover:text-amber-700"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          }
        >
          {companies.length === 0 && !loading ? (
            <EmptyState title="No companies found" message="Create company records through the existing backend endpoints." />
          ) : (
            <DataTable
              columns={[
                { key: 'company_id', label: 'Company ID' },
                { key: 'name', label: 'Name' },
                { key: 'location', label: 'Location' },
                { key: 'ctc_stipend', label: 'CTC/Stipend' },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (_, row) => (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleView(row._id)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-200 hover:text-amber-700"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row)}
                        disabled={actionId === row._id}
                        className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300"
                      >
                        {actionId === row._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={companies}
              emptyMessage={loading ? 'Loading companies...' : 'No companies found.'}
            />
          )}
        </SectionCard>

        <SectionCard title="Company Details" subtitle="Select a company to inspect its stored fields.">
          {selectedCompany ? (
            <div className="space-y-4 text-sm text-slate-700">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Company ID</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{selectedCompany.company_id}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Name</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{selectedCompany.name}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Location</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{selectedCompany.location}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">CTC / Stipend</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{selectedCompany.ctc_stipend}</p>
              </div>
            </div>
          ) : (
            <EmptyState title="No company selected" message="Use the View action to inspect a company record." />
          )}
        </SectionCard>
      </section>
    </AppShell>
  )
}

export default AdminCompaniesPage
