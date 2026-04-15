import { useCallback, useEffect, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import DataTable from '../components/DataTable.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SectionCard from '../components/SectionCard.jsx'
import { adminSidebarItems } from '../utils/adminNavigation.js'
import {
  createStudent,
  deleteAdminStudent,
  getAdminStudentById,
  getAdminStudents,
  getErrorMessage,
} from '../services/api.js'

const initialStudentForm = {
  roll_no: '',
  full_name: '',
  branch: '',
  cgpa: '',
}

function AdminStudentsPage() {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentForm, setStudentForm] = useState(initialStudentForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [actionId, setActionId] = useState('')
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const loadStudents = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getAdminStudents()
      setStudents(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load students.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  const handleCreateStudent = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setFeedback('')

    try {
      const createdStudent = await createStudent({
        roll_no: studentForm.roll_no.trim(),
        name: studentForm.full_name
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        branch: studentForm.branch.trim(),
        cgpa: studentForm.cgpa,
      })

      setFeedback('Student added successfully.')
      setStudentForm(initialStudentForm)
      setSelectedStudent(createdStudent)
      await loadStudents()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create student.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleView = async (id) => {
    setError('')
    setFeedback('')

    try {
      const data = await getAdminStudentById(id)
      setSelectedStudent(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load student details.'))
    }
  }

  const handleDelete = async (student) => {
    const confirmed = window.confirm(`Delete ${student.name.join(' ')} and the linked placement data?`)

    if (!confirmed) {
      return
    }

    setActionId(student._id)
    setError('')
    setFeedback('')

    try {
      await deleteAdminStudent(student._id)
      setFeedback('Student deleted successfully.')
      if (selectedStudent?._id === student._id) {
        setSelectedStudent(null)
      }
      await loadStudents()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete student.'))
    } finally {
      setActionId('')
    }
  }

  return (
    <AppShell
      title="Students"
      subtitle="Review student records, inspect one profile at a time, and remove students when necessary."
      roleLabel="Admin Panel"
      notice="Deleting a student also removes related applications, stages, and final placement records tied to that roll number."
      sidebarItems={adminSidebarItems}
    >
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}
      {feedback ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</div>
      ) : null}

      <SectionCard title="Add Student" subtitle="Create a new student record from the admin panel.">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreateStudent}>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="Roll number"
            value={studentForm.roll_no}
            onChange={(event) =>
              setStudentForm((current) => ({ ...current, roll_no: event.target.value }))
            }
            required
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="Branch"
            value={studentForm.branch}
            onChange={(event) =>
              setStudentForm((current) => ({ ...current, branch: event.target.value }))
            }
            required
          />
          <input
            className="md:col-span-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="Full name"
            value={studentForm.full_name}
            onChange={(event) =>
              setStudentForm((current) => ({ ...current, full_name: event.target.value }))
            }
            required
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="CGPA"
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={studentForm.cgpa}
            onChange={(event) =>
              setStudentForm((current) => ({ ...current, cgpa: event.target.value }))
            }
            required
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Names are stored using the existing array-based schema. Use commas only if you intentionally want multiple name values.
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitting ? 'Adding student...' : 'Add student'}
          </button>
        </form>
      </SectionCard>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Student Registry"
          subtitle="Current student entries pulled from the backend."
          action={
            <button
              type="button"
              onClick={loadStudents}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-200 hover:text-amber-700"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          }
        >
          {students.length === 0 && !loading ? (
            <EmptyState title="No students found" message="Student records will appear here once they are created." />
          ) : (
            <DataTable
              columns={[
                { key: 'roll_no', label: 'Roll No' },
                {
                  key: 'name',
                  label: 'Name',
                  render: (value) => value.join(' '),
                },
                { key: 'branch', label: 'Branch' },
                { key: 'cgpa', label: 'CGPA' },
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
              rows={students}
              emptyMessage={loading ? 'Loading students...' : 'No students found.'}
            />
          )}
        </SectionCard>

        <SectionCard title="Student Details" subtitle="Select a student to inspect stored data.">
          {selectedStudent ? (
            <div className="space-y-4 text-sm text-slate-700">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Roll number</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{selectedStudent.roll_no}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Name</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{selectedStudent.name.join(' ')}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Branch</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{selectedStudent.branch}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">CGPA</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{selectedStudent.cgpa}</p>
              </div>
            </div>
          ) : (
            <EmptyState title="No student selected" message="Use the View action to inspect a student record." />
          )}
        </SectionCard>
      </section>
    </AppShell>
  )
}

export default AdminStudentsPage
