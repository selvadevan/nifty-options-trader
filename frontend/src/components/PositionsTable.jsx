import React from 'react'
import { Loader2 } from 'lucide-react'

const PositionsTable = ({ positions, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>Error loading positions: {error}</p>
      </div>
    )
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>No active positions</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Symbol</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Type</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Quantity</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Avg Price</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">LTP</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">P&L</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">P&L %</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position, index) => {
            const pnl = position.pnl || 0
            const pnlPercent = position.buy_value ? (pnl / position.buy_value) * 100 : 0
            const isProfitable = pnl >= 0

            return (
              <tr 
                key={index} 
                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-3 px-4 text-sm font-medium text-slate-100">
                  {position.tradingsymbol}
                </td>
                <td className="py-3 px-4 text-sm text-slate-300">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    position.transaction_type === 'SELL' 
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {position.transaction_type}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-right text-slate-300">
                  {position.quantity}
                </td>
                <td className="py-3 px-4 text-sm text-right text-slate-300">
                  ₹{position.average_price?.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-sm text-right text-slate-300">
                  ₹{position.last_price?.toFixed(2)}
                </td>
                <td className={`py-3 px-4 text-sm text-right font-semibold ${
                  isProfitable ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isProfitable ? '+' : ''}₹{pnl.toFixed(2)}
                </td>
                <td className={`py-3 px-4 text-sm text-right font-semibold ${
                  isProfitable ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isProfitable ? '+' : ''}{pnlPercent.toFixed(2)}%
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default PositionsTable