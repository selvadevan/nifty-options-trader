import React, { useState } from 'react'
import axios from 'axios'
import { Play, Loader2, CheckCircle, XCircle } from 'lucide-react'

const StrategyView = () => {
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
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold mb-6 text-slate-100">Execute Put Selling Strategy</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Strategy Configuration */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Capital to Deploy (₹)
            </label>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="3"
            />
            <p className="text-xs text-slate-400 mt-1">Recommended: 3-5 strikes</p>
          </div>

          <button
            onClick={handleExecute}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Executing Strategy...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Execute Strategy</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column - Strategy Info & Results */}
        <div className="space-y-6">
          {/* Strategy Details */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-400 mb-3">Strategy Details</h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span><strong>Expiry:</strong> 30-45 days out (weekly NIFTY)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span><strong>Type:</strong> OTM Put Selling</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span><strong>Product:</strong> NRML (Positional Trading)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span><strong>Stop Loss:</strong> 30% of premium received</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span><strong>Target:</strong> 50-70% premium decay</span>
              </li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-400 mb-1">Execution Failed</h3>
                  <p className="text-sm text-slate-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className={`border rounded-lg p-4 ${
              result.status === 'completed'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-start space-x-2 mb-3">
                {result.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <h3 className={`text-sm font-semibold ${
                  result.status === 'completed' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result.status === 'completed' ? 'Strategy Executed Successfully!' : 'Execution Failed'}
                </h3>
              </div>
              
              {result.orders && result.orders.length > 0 && (
                <div className="text-sm text-slate-300 space-y-2">
                  <p className="font-medium">Orders Placed: {result.orders.length}</p>
                  <div className="space-y-1">
                    {result.orders.map((order, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                        <span className="font-mono">{order.symbol}</span>
                        <span>{order.quantity} lots @ ₹{order.premium}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {result.errors && result.errors.length > 0 && (
                <div className="text-sm text-red-400 space-y-1 mt-2">
                  {result.errors.map((err, idx) => (
                    <p key={idx}>• {err}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StrategyView