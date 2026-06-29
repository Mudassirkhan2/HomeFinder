import { useEffect, useState } from 'react'
import { useLocation, Link, useNavigate } from "react-router-dom"
import { BsFillMoonStarsFill, BsSun } from "react-icons/bs"
import { FaSearch, FaHeart } from "react-icons/fa"
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user } = useAuth()
  const loggedIn = !!user
  const pageState = user ? "Profile" : "Sign in"
  const [theme, setTheme] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme')
    setTheme(localTheme ?? 'dark')
  }, [])

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
    if (theme === 'dark') {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    }
  }, [theme])

  const handleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    window.localStorage.setItem('theme', next)
  }

  function pathMatchRoute(route) {
    return route === location.pathname
  }

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <div className="sticky top-0 z-30 bg-surface dark:bg-dark-bg border-b border-surface-border dark:border-dark-border shadow-sm font-BarlowCondensed">
      <header className="flex items-stretch justify-between max-w-6xl px-3 mx-auto h-14 gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center">
          <p className="font-bold font-RampartOne text-content-primary dark:text-white">
            Home<span className="text-primary">Finder</span>
          </p>
        </Link>

        {/* Search bar — desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex self-center flex-1 max-w-sm">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or area..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-surface-secondary dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-full text-content-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </form>

        {/* Nav links */}
        <ul className="flex items-stretch gap-4 md:gap-6">
          {/* Mobile search toggle */}
          <li className="md:hidden flex items-center">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-content-secondary dark:text-content-muted hover:text-primary transition-colors"
              aria-label="Search"
            >
              <FaSearch className="text-base" />
            </button>
          </li>

          <li className="flex items-center">
            <button onClick={handleTheme} className="text-content-secondary dark:text-content-muted hover:text-content-primary dark:hover:text-white transition-colors">
              {theme === 'light' ? <BsFillMoonStarsFill className="text-lg" /> : <BsSun className="text-lg" />}
            </button>
          </li>

          {/* Desktop-only nav links — bottom tab bar handles mobile */}
          <li className="hidden md:flex items-stretch">
            <Link to="/" className={`flex items-center text-sm font-semibold border-b-[3px] transition-colors ${pathMatchRoute("/")
              ? "text-content-primary dark:text-white border-primary"
              : "text-content-secondary dark:text-content-muted border-transparent hover:text-content-primary dark:hover:text-white"
              }`}>
              Home
            </Link>
          </li>

          <li className="hidden md:flex items-stretch">
            <Link to="/offers" className={`flex items-center text-sm font-semibold border-b-[3px] transition-colors ${pathMatchRoute("/offers")
              ? "text-content-primary dark:text-white border-primary"
              : "text-content-secondary dark:text-content-muted border-transparent hover:text-content-primary dark:hover:text-white"
              }`}>
              Offers
            </Link>
          </li>

          {loggedIn && (
            <li className="hidden md:flex items-stretch">
              <Link to="/saved" title="Saved Properties" className={`flex items-center gap-1 text-sm font-semibold border-b-[3px] transition-colors ${pathMatchRoute("/saved")
                ? "text-content-primary dark:text-white border-primary"
                : "text-content-secondary dark:text-content-muted border-transparent hover:text-content-primary dark:hover:text-white"
                }`}>
                <FaHeart className="text-primary text-xs" />
                Saved
              </Link>
            </li>
          )}

          <li className="hidden md:flex items-stretch">
            <Link to="/profile" className={`flex items-center text-sm font-semibold border-b-[3px] transition-colors ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile"))
              ? "text-content-primary dark:text-white border-primary"
              : "text-content-secondary dark:text-content-muted border-transparent hover:text-content-primary dark:hover:text-white"
              }`}>
              {pageState}
            </Link>
          </li>
        </ul>
      </header>

      {/* Mobile search bar — expands below header */}
      {searchOpen && (
        <form onSubmit={handleSearch} className="md:hidden px-3 pb-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted text-sm" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or area..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface-secondary dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-full text-content-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </form>
      )}
    </div>
  )
}

export default Navbar
