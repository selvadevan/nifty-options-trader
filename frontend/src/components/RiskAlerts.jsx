import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AlertTriangle, X } from 'lucide-react'

const RiskAlerts = () => {
  const [alerts, setAlerts] = useState([])
  const [dismissed, setDismissed] = useState(new Set())

  useEffect(() => {
    const fetchRiskAnalysis = async () => {
      try {
        const response = await axios.get('/api/analytics/positions/monitor')
        if (response.data.success && response.data.analysis.positions_at_risk) {
          setAlerts(response.data.analysis.positions_at_risk)
        }
      } catch (err) {
        console.error('Failed to fetch risk analysis:', err)
      }
    }

    fetchRiskAnalysis()
    const interval = setInterval(fetchRiskAnalysis, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const handleDismiss = (symbol) => {
    setDismissed(prev => new Set([...prev, symbol]))
  }

  const activeAlerts = alerts.filter(alert => !dismissed.has(alert.symbol))

  if (activeAlerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {activeAlerts.map((alert, index) => (
        <div
          key={index}
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start justify-between"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-400 mb-1">
                Stop Loss Alert: {alert.symbol}
              </h3>
              <p className="text-xs text-slate-300">
                Position has lost {alert.loss_percent?.toFixed(2)}% of premium. 
                Action recommended: {alert.action}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleDismiss(alert.symbol)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default RiskAlerts