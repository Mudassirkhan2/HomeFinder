import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaTag, FaHeart, FaUser } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const BottomNav = () => {
  const { user } = useAuth()
  const location = useLocation()

  const tabs = [
    { to: '/', label: 'Home', icon: FaHome },
    { to: '/offers', label: 'Offers', icon: FaTag },
    ...(user ? [{ to: '/saved', label: 'Saved', icon: FaHeart }] : []),
    { to: user ? '/profile' : '/sign-in', label: user ? 'Profile' : 'Sign in', icon: FaUser },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface dark:bg-dark-bg border-t border-surface-border dark:border-dark-border">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link key={to} to={to} className="flex flex-col items-center gap-1 flex-1 py-2">
              <Icon className={`text-xl transition-colors ${active ? 'text-primary' : 'text-content-secondary dark:text-content-muted'}`} />
              <span className={`text-[10px] font-semibold font-BarlowCondensed transition-colors ${active ? 'text-primary' : 'text-content-secondary dark:text-content-muted'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
