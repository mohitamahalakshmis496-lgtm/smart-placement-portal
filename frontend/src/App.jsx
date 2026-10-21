import { Routes, Route } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'

import StudentDashboard from './pages/student/StudentDashboard'
import StudentJobs from './pages/student/StudentJobs'
import StudentApplications from './pages/student/StudentApplications'
import StudentProfile from './pages/student/StudentProfile'
import AIMatch from './pages/student/AIMatch'

import FacultyDashboard from './pages/faculty/FacultyDashboard'
import FacultyStudents from './pages/faculty/FacultyStudents'
import FacultyMentees from './pages/faculty/FacultyMentees'

import CompanyDashboard from './pages/company/CompanyDashboard'
import CompanyJobs from './pages/company/CompanyJobs'
import CompanyApplicants from './pages/company/CompanyApplicants'
import CompanyProfile from './pages/company/CompanyProfile'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCompanies from './pages/admin/AdminCompanies'
import AdminJobs from './pages/admin/AdminJobs'
import AdminAnalytics from './pages/admin/AdminAnalytics'

export default function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* STUDENT ROUTES */}

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/jobs"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/applications"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/ai-match"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <AIMatch />
          </ProtectedRoute>
        }
      />


      {/* FACULTY ROUTES */}

      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty/students"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyStudents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty/mentees"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyMentees />
          </ProtectedRoute>
        }
      />


      {/* COMPANY ROUTES */}

      <Route
        path="/company"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/jobs"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <CompanyJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/applicants"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <CompanyApplicants />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/profile"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <CompanyProfile />
          </ProtectedRoute>
        }
      />


      {/* ADMIN ROUTES */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/companies"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCompanies />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAnalytics />
          </ProtectedRoute>
        }
      />


      {/* FALLBACK */}

      <Route
        path="*"
        element={<Login />}
      />

    </Routes>
  )
}