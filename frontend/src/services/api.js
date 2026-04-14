import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getErrorMessage(error, fallback = 'Something went wrong.') {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  )
}

export function normalizeStudentPayload(student) {
  return {
    ...student,
    name: Array.isArray(student?.name) ? student.name : [student?.name].filter(Boolean),
  }
}

export async function getStudents() {
  const { data } = await api.get('/students')
  return Array.isArray(data) ? data.map(normalizeStudentPayload) : []
}

export async function createStudent(payload) {
  const preparedPayload = {
    ...payload,
    name: Array.isArray(payload.name) ? payload.name : [payload.name].filter(Boolean),
    cgpa: Number(payload.cgpa),
  }

  const { data } = await api.post('/students', preparedPayload)
  return normalizeStudentPayload(data)
}

export async function getCompanies() {
  const { data } = await api.get('/companies')
  return Array.isArray(data) ? data : []
}

export async function createCompany(payload) {
  const { data } = await api.post('/companies', {
    ...payload,
    ctc_stipend: Number(payload.ctc_stipend),
  })
  return data
}

export async function getApplications() {
  const { data } = await api.get('/applications')
  return Array.isArray(data) ? data : []
}

export async function applyToCompany(payload) {
  const { data } = await api.post('/applications/apply', payload)
  return data
}

export async function getStages() {
  const { data } = await api.get('/stages')
  return Array.isArray(data) ? data : []
}

export async function getPlacements() {
  const { data } = await api.get('/placements')
  return Array.isArray(data) ? data : []
}

export default api
