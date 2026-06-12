import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Map, Star, Settings, Menu, X, Plus } from 'lucide-react'

const links = [
  { to: '/', label: 'Putovanja', icon: <Map size={16} />, end: true },
  { to: '/bucket-list', label: 'Lista želja', icon: <Star size={16} />, end: false },
  { to: '/settings', label: 'Podešavanja', icon: <Settings size={16} />, end: false },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg select-none">
            <span className="text-2xl">✈️</span>
            <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent font-extrabold">
              Naš Odmor
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/trips/new"
              className="ml-2 flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={15} /> Novi odmor
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-3 border-t border-slate-100 pt-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/trips/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 bg-rose-50"
            >
              <Plus size={16} /> Novi odmor
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
