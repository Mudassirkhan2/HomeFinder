import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'

const shimmer = 'bg-surface-border dark:bg-dark-border animate-pulse rounded'

const PrivateRouteSkeleton = () => (
  <div className="min-h-screen bg-surface-secondary dark:bg-dark-bg px-4 pt-6">
    <div className="max-w-6xl mx-auto space-y-4">
      <div className={`h-8 w-48 ${shimmer}`} />
      <div className={`h-64 w-full rounded-2xl ${shimmer}`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`h-48 rounded-xl ${shimmer}`} />
        ))}
      </div>
    </div>
  </div>
)

const PrivateRoute = () => {
  const { login, checkingStatus } = useAuthStatus()
  if (checkingStatus) return <PrivateRouteSkeleton />
  return login ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivateRoute
