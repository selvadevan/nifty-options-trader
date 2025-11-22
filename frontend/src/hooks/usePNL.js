import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

export const usePNL = (refreshInterval = 3000) => {
  const [pnlData, setPnlData] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchPNL = async () => {
    try {
      const response = await axios.get('/api/analytics/pnl/summary')
      if (response.data.success) {
        setSummary(response.data.data)
        
        // Add current data point to chart
        setPnlData(prev => {
          const newDataPoint = {
            time: format(new Date(), 'HH:mm:ss'),
            pnl: response.data.data.total_pnl,
            realized: response.data.data.realized_pnl,
            unrealized: response.data.data.unrealized_pnl
          }
          
          // Keep last 100 data points
          const updated = [...prev, newDataPoint]
          return updated.slice(-100)
        })
      }
    } catch (err) {
      console.error('Failed to fetch P&L:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPNL()
    const interval = setInterval(fetchPNL, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  return { pnlData, summary, loading }
}