import { createContext, useEffect, useState } from 'react'
import {
  adminLogin,
  createStudent,
  getStudents,
  normalizeStudentPayload,
  setAdminAuthToken,
} from '../services/api.js'

const STORAGE_KEY = 'placement-management-session'
const AuthContext = createContext(null)

function readStoredSession() {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession())

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }

    setAdminAuthToken(session?.role === 'admin' ? session?.token : null)
  }, [session])

  const loginStudent = async ({ rollNo, fullName }) => {
    const students = await getStudents()
    const normalizedRollNo = rollNo.trim().toLowerCase()
    const normalizedName = fullName.trim().toLowerCase()

    const student = students.find((item) => {
      const itemRoll = String(item.roll_no ?? '').trim().toLowerCase()
      const joinedName = Array.isArray(item.name)
        ? item.name.join(' ').trim().toLowerCase()
        : String(item.name ?? '').trim().toLowerCase()

      return itemRoll === normalizedRollNo && joinedName === normalizedName
    })

    if (!student) {
      throw new Error('Student record not found. Use the registered roll number and full name.')
    }

    setSession({
      role: 'student',
      user: normalizeStudentPayload(student),
    })

    return student
  }

  const registerStudent = async (payload) => {
    const createdStudent = await createStudent(payload)
    const normalized = normalizeStudentPayload(createdStudent)

    setSession({
      role: 'student',
      user: normalized,
    })

    return normalized
  }

  const loginAdmin = async ({ adminId, password }) => {
    const response = await adminLogin({
      admin_id: adminId.trim(),
      password,
    })

    setSession({
      role: 'admin',
      user: response.admin,
      token: response.token,
    })

    return response.admin
  }

  const logout = () => setSession(null)

  return (
    <AuthContext.Provider
      value={{
        role: session?.role ?? null,
        user: session?.user ?? null,
        token: session?.token ?? null,
        isAuthenticated: Boolean(session),
        loginStudent,
        registerStudent,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
