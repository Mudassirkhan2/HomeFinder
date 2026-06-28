import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import property from '../assets/property.png'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setSent(true)
    toast.success('If that email exists, a reset link has been sent.')
  }

  return (
    <section className="min-h-screen">
      <motion.h1
        className="mt-6 text-3xl font-bold text-center text-content-primary dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Forgot Password
      </motion.h1>

      <div className="flex flex-wrap items-center justify-center max-w-6xl px-6 py-12 mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img src={property} alt="Property" className="w-full rounded-2xl" />
        </div>

        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          {sent ? (
            <p className="text-content-secondary dark:text-content-muted text-center">
              Check your inbox for a reset link.{' '}
              <Link to="/sign-in" className="text-primary hover:text-primary-hover">Back to Sign In</Link>
            </p>
          ) : (
            <form onSubmit={onSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full px-4 py-2 mb-6 text-xl text-content-primary dark:text-white bg-surface dark:bg-dark-surface border border-surface-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition ease-in-out"
              />
              <div className="flex justify-between text-sm whitespace-nowrap sm:text-lg mb-6">
                <p className="text-content-secondary dark:text-content-muted">
                  Don't have an account?{' '}
                  <Link to="/sign-up" className="ml-1 text-primary hover:text-primary-hover">Register</Link>
                </p>
                <Link to="/sign-in" className="text-primary hover:text-primary-hover">Sign in instead</Link>
              </div>
              <button
                type="submit"
                className="w-full py-3 text-sm font-semibold text-white uppercase bg-primary hover:bg-primary-hover rounded-lg shadow-md transition duration-150"
              >
                Send reset link
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword
