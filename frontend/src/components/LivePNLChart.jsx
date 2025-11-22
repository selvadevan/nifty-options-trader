import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'

const LivePNLChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <p>Waiting for P&L data...</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="time" 
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af' }}
        />
        <YAxis 
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af' }}
          tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px'
          }}
          labelStyle={{ color: '#e2e8f0' }}
          formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
        />
        <Legend 
          wrapperStyle={{ color: '#e2e8f0' }}
        />
        <Line 
          type="monotone" 
          dataKey="pnl" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Total P&L"
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="realized" 
          stroke="#10b981" 
          strokeWidth={2}
          name="Realized"
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="unrealized" 
          stroke="#f59e0b" 
          strokeWidth={2}
          name="Unrealized"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LivePNLChart