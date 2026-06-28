import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export function useSavedListings() {
  const { user } = useAuth()
  const [savedIds, setSavedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setSavedIds(new Set())
      setLoading(false)
      return
    }
    api.get('/saved')
      .then((res) => setSavedIds(new Set(res.data.savedIds)))
      .catch(() => setSavedIds(new Set()))
      .finally(() => setLoading(false))
  }, [user])

  async function toggleSave(listingId) {
    if (!user) return
    if (savedIds.has(listingId)) {
      await api.delete(`/saved/${listingId}`)
      setSavedIds((prev) => { const n = new Set(prev); n.delete(listingId); return n })
    } else {
      await api.post(`/saved/${listingId}`)
      setSavedIds((prev) => new Set(prev).add(listingId))
    }
  }

  return { savedIds, toggleSave, loading }
}
