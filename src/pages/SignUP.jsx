import { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import property from '../assets/property.png'

const INPUT_CLASS = "w-full px-4 py-2 mb-6 text-xl text-content-primary dark:text-white bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition ease-in-out"

const SignUP = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formdata, setFormData] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
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
    <section className="min-h-screen">
      <motion.h1
        className="mt-6 text-3xl font-bold text-center text-content-primary dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Sign Up
      </motion.h1>

      <div className="flex flex-wrap items-center justify-center max-w-6xl px-6 py-12 mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img src={property} alt="Property" className="w-full rounded-2xl" />
        </div>

        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onSubmit}>
            <input type="text" id="name" value={name} className={INPUT_CLASS} onChange={onChange} placeholder="Full name" required />
            <input type="email" id="email" value={email} className={INPUT_CLASS} onChange={onChange} placeholder="Email address" required />

            <div className="relative mb-6">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                className="w-full px-4 py-2 text-xl text-content-primary dark:text-white bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition ease-in-out"
                onChange={onChange}
                placeholder="Password (min 6 characters)"
                required
                minLength={6}
              />
              {showPassword
                ? <AiFillEyeInvisible className="absolute text-2xl text-content-muted cursor-pointer right-4 top-4" onClick={() => setShowPassword(false)} />
                : <AiFillEye className="absolute text-2xl text-content-muted cursor-pointer right-4 top-4" onClick={() => setShowPassword(true)} />
              }
            </div>

            <div className="flex justify-between text-sm whitespace-nowrap sm:text-lg mb-6">
              <p className="text-content-secondary dark:text-content-muted">
                Have an account?{' '}
                <Link to="/sign-in" className="ml-1 text-primary hover:text-primary-hover transition duration-200">Sign In</Link>
              </p>
              <Link to="/forgot-password" className="text-primary hover:text-primary-hover transition duration-200">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold text-white uppercase bg-primary hover:bg-primary-hover rounded-lg shadow-md transition duration-150 disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SignUP
