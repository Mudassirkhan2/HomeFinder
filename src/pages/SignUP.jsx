import { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import OAuth from '../components/OAuth'
import property from '../assets/property.png'

const SignUP = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formdata, setFormData] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const { name, email, password } = formdata

  function onChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password)
      toast.success('Registration successful')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen">

      {/* ── Brand panel (left, desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col bg-primary">
        <img
          src={property}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-hover/75 to-dark-bg/80" />

        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
          <span className="text-2xl font-extrabold tracking-tight">
            Home<span className="opacity-70">Finder</span>
          </span>

          <div>
            <span className="inline-block bg-accent text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
              12,000+ listings
            </span>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight mb-4 max-w-sm">
              Find a place you'll love to call home.
            </h2>
            <p className="text-white/82 text-[15px] leading-relaxed max-w-sm">
              Browse verified homes for sale and rent across India — save favourites and reach owners directly.
            </p>
          </div>

          <p className="text-white/60 text-sm">© 2026 HomeFinder</p>
        </div>
      </div>

      {/* ── Form panel (right) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-surface dark:bg-dark-bg relative">

        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Link to="/" className="inline-block text-[22px] font-extrabold tracking-tight mb-7">
            <span className="text-content-primary dark:text-white">Home</span>
            <span className="text-primary">Finder</span>
          </Link>

          <h1 className="text-[27px] font-extrabold tracking-tight text-content-primary dark:text-white mb-1.5">
            Create an account
          </h1>
          <p className="text-sm text-content-secondary dark:text-content-muted mb-7">
            Join HomeFinder for free
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <label className="block">
              <span className="block text-[12.5px] font-semibold text-content-secondary dark:text-content-muted mb-1.5">
                Full name
              </span>
              <input
                type="text"
                id="name"
                value={name}
                onChange={onChange}
                placeholder="Mudassir Khan"
                required
                className="w-full bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-[11px] px-3.5 py-3 text-sm text-content-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </label>

            <label className="block">
              <span className="block text-[12.5px] font-semibold text-content-secondary dark:text-content-muted mb-1.5">
                Email address
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={onChange}
                placeholder="you@example.com"
                required
                className="w-full bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-[11px] px-3.5 py-3 text-sm text-content-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </label>

            <label className="block">
              <span className="block text-[12.5px] font-semibold text-content-secondary dark:text-content-muted mb-1.5">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-[11px] px-3.5 py-3 pr-11 text-sm text-content-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-secondary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <AiFillEyeInvisible className="text-xl" /> : <AiFillEye className="text-xl" />}
                </button>
              </div>
            </label>

            <label className="flex items-center gap-2 text-[13px] text-content-secondary dark:text-content-muted cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-3.5 h-3.5 accent-primary"
              />
              I agree to the terms &amp; privacy policy
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl shadow-btn-hover transition-all duration-150 disabled:opacity-60 text-[15px]"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <span className="flex-1 h-px bg-surface-border dark:bg-dark-border" />
            <span className="text-xs text-content-muted">or continue with</span>
            <span className="flex-1 h-px bg-surface-border dark:bg-dark-border" />
          </div>

          <OAuth />

          <p className="mt-7 text-center text-sm text-content-secondary dark:text-content-muted">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-primary font-bold hover:text-primary-hover transition-colors">
              Sign in →
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  )
}

export default SignUP
