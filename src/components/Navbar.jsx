import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Plus, Plane } from 'lucide-react'

const links = [
  { to: '/', label: 'Putovanja', end: true },
  { to: '/explore', label: 'Istraži', end: false },
  { to: '/bucket-list', label: 'Lista želja', end: false },
  { to: '/settings', label: 'Podešavanja', end: false },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-[#131918] sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
              <Plane size={16} className="text-gold" />
            </div>
            <span className="font-display italic text-gold text-xl font-semibold tracking-wide">
              Naš Odmor
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-gold bg-white/5'
                      : 'text-white/55 hover:text-white/90 hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/trips/new"
              className="ml-3 flex items-center gap-1.5 bg-gold text-[#131918] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors"
            >
              <Plus size={15} /> Novi odmor
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-3 border-t border-white/10 pt-2 space-y-0.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-gold bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/trips/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-gold"
            >
              <Plus size={16} /> Novi odmor
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
