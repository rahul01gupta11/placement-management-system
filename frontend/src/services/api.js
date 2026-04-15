import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function setAdminAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete api.defaults.headers.common.Authorization
}

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

export async function adminLogin(payload) {
  const { data } = await api.post('/admin/login', payload)
  return data
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

export async function getAdminCompanies() {
  const { data } = await api.get('/admin/companies')
  return Array.isArray(data) ? data : []
}

export async function getAdminCompanyById(id) {
  const { data } = await api.get(`/admin/companies/${id}`)
  return data
}

export async function deleteAdminCompany(id) {
  const { data } = await api.delete(`/admin/companies/${id}`)
  return data
}

export async function getAdminStudents() {
  const { data } = await api.get('/admin/students')
  return Array.isArray(data) ? data.map(normalizeStudentPayload) : []
}

export async function getAdminStudentById(id) {
  const { data } = await api.get(`/admin/students/${id}`)
  return normalizeStudentPayload(data)
}

export async function deleteAdminStudent(id) {
  const { data } = await api.delete(`/admin/students/${id}`)
  return data
}

export async function getAdminApplications() {
  const { data } = await api.get('/admin/applications')
  return Array.isArray(data) ? data : []
}

export async function deleteAdminApplication(id) {
  const { data } = await api.delete(`/admin/applications/${id}`)
  return data
}

export async function getAdminApplicationStats() {
  const { data } = await api.get('/admin/applications/stats')
  return data
}

export async function getAdminStats() {
  const { data } = await api.get('/admin/stats')
  return data
}

export default api
