import React, { useState } from 'react'
import axios from 'axios'
import { X, Play, Loader2 } from 'lucide-react'

const StrategyCard = ({ onClose }) => {
  const [capital, setCapital] = useState(100000)
  const [targetStrikes, setTargetStrikes] = useState(3)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleExecute = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post('/api/orders/strategy/execute', {
        capital: parseInt(capital),
        target_strikes: parseInt(targetStrikes)
      })

      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">Execute Put Selling Strategy</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Capital to Deploy (₹)
            </label>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Number of Strikes
            </label>
            <input
              type="number"
              value={targetStrikes}
              onChange={(e) => setTargetStrikes(e.target.value)}
              min="1"
              max="5"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="3"
            />
            <p className="text-xs text-slate-400 mt-1">Recommended: 3-5 strikes</p>
          </div>

          {/* Strategy Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">Strategy Details</h3>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• Expiry: 30-45 days out</li>
              <li>• Type: OTM Put selling</li>
              <li>• Product: NRML (Positional)</li>
              <li>• Stop Loss: 30% of premium</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className={`border rounded-lg p-4 ${
              result.status === 'completed'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <h3 className={`text-sm font-semibold mb-2 ${
                result.status === 'completed' ? 'text-green-400' : 'text-red-400'
              }`}>
                {result.status === 'completed' ? 'Strategy Executed Successfully!' : 'Execution Failed'}
              </h3>
              {result.orders && result.orders.length > 0 && (
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-medium">Orders Placed: {result.orders.length}</p>
                  {result.orders.map((order, idx) => (
                    <p key={idx}>
                      • {order.symbol} - {order.quantity} lots @ ₹{order.premium}
                    </p>
                  ))}
                </div>
              )}
              {result.errors && result.errors.length > 0 && (
                <div className="text-xs text-red-400 space-y-1 mt-2">
                  {result.errors.map((err, idx) => (
                    <p key={idx}>• {err}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Execute Strategy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StrategyCard