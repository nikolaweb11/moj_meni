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
    <nav className="bg-white sticky top-0 z-50 border-b border-linen shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 bg-forest/10 rounded-lg flex items-center justify-center">
              <Plane size={16} className="text-forest" />
            </div>
            <span className="font-display italic text-forest text-xl font-semibold tracking-wide">
              Naša Priča
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
                      ? 'text-forest bg-forest/10'
                      : 'text-ink-light hover:text-ink hover:bg-linen/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/trips/new"
              className="ml-3 flex items-center gap-1.5 bg-forest text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-forest-light transition-colors"
            >
              <Plus size={15} /> Novi odmor
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-ink-light hover:text-ink hover:bg-linen transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-3 border-t border-linen pt-2 space-y-0.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-forest bg-forest/10' : 'text-ink-light hover:text-ink hover:bg-linen/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/trips/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-forest"
            >
              <Plus size={16} /> Novi odmor
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
