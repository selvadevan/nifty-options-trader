import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

const HoldingsView = () => {
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await axios.get('/api/orders/holdings')
        if (response.data.success) {
          setHoldings(response.data.data)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHoldings()
    const interval = setInterval(fetchHoldings, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-slate-700">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-slate-700">
        <div className="text-center py-12 text-red-400">
          <p>Error loading holdings: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-slate-100">Holdings</h2>
      
      {holdings.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>No holdings found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Symbol</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Exchange</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Quantity</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Avg Price</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">LTP</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">P&L</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Day Change %</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => {
                const pnl = holding.pnl || 0
                const dayChange = holding.day_change_percentage || 0
                const isProfitable = pnl >= 0

                return (
                  <tr 
                    key={index} 
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-slate-100">
                      {holding.tradingsymbol}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-300">
                      {holding.exchange}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-300">
                      {holding.quantity}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-300">
                      ₹{holding.average_price?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-300">
                      ₹{holding.last_price?.toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-semibold ${
                      isProfitable ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isProfitable ? '+' : ''}₹{pnl.toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-semibold ${
                      dayChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {dayChange >= 0 ? '+' : ''}{dayChange.toFixed(2)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default HoldingsView