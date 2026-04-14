import { createContext, useEffect, useState } from 'react'
import {
  createStudent,
  getStudents,
  normalizeStudentPayload,
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
      return
    }

    localStorage.removeItem(STORAGE_KEY)
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

  const loginAdmin = ({ adminId, adminName }) => {
    const safeAdminId = adminId.trim()
    const safeAdminName = adminName.trim()

    if (!safeAdminId || !safeAdminName) {
      throw new Error('Enter both admin ID and admin name.')
    }

    setSession({
      role: 'admin',
      user: {
        admin_id: safeAdminId,
        name: safeAdminName,
      },
      meta: {
        isFrontendOnly: true,
      },
    })
  }

  const logout = () => setSession(null)

  return (
    <AuthContext.Provider
      value={{
        role: session?.role ?? null,
        user: session?.user ?? null,
        meta: session?.meta ?? null,
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
