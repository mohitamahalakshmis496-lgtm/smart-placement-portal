import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

/**
 * Shared shell for every role's dashboard.
 * Usage:
 *   <DashboardLayout title="Dashboard" navItems={studentNav}>
 *     ...page content...
 *   </DashboardLayout>
 */
export default function DashboardLayout({ title, navItems, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-navy-900">
      <Sidebar items={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
