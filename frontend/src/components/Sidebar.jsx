import { NavLink } from 'react-router-dom'

/**
 * items: [{ label, to, end? }]
 * Rendered inside a fixed-width column on desktop; the parent
 * (DashboardLayout) handles collapsing it on smaller screens.
 */
export default function Sidebar({ items, open, onClose }) {
  return (
    <>
      {/* backdrop on mobile when the sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`bg-navy-700 text-slate-100 w-64 shrink-0 flex flex-col fixed md:static inset-y-0 left-0 z-30
          transform transition-transform duration-200 md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-5 py-5 border-b border-navy-600 flex items-center gap-2.5">
          <span className="h-8 w-8 rounded bg-gold-500 text-navy-900 font-serif font-semibold flex items-center justify-center shrink-0">
            S
          </span>
          <div>
            <p className="font-serif text-base font-semibold text-white leading-tight">Smart Placement</p>
            <p className="text-xs text-navy-100/70">Portal</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-5 py-2.5 text-sm border-l-2 transition-colors ${
                  isActive
                    ? 'bg-navy-600 border-gold-500 text-white font-medium'
                    : 'border-transparent text-navy-100/80 hover:bg-navy-600/60 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
