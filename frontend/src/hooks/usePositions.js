import { useState, useEffect } from 'react'
import axios from 'axios'

export const usePositions = (refreshInterval = 5000) => {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPositions = async () => {
    try {
      const response = await axios.get('/api/orders/positions')
      if (response.data.success) {
        setPositions(response.data.data)
        setError(null)
      }
    } catch (err) {
      setError(err.message)
      console.error('Failed to fetch positions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPositions()
    const interval = setInterval(fetchPositions, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  return { positions, loading, error, refetch: fetchPositions }
}