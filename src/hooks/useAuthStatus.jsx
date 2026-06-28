import { useAuth } from '../context/AuthContext'

export function useAuthStatus() {
  const { user, checkingStatus } = useAuth()
  return { login: !!user, checkingStatus }
}
