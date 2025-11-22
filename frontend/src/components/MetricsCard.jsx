import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const MetricsCard = ({ title, value, change, icon, trend }) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500'
    if (trend === 'down') return 'text-red-500'
    return 'text-slate-400'
  }

  const getBgColor = () => {
    if (trend === 'up') return 'bg-green-500/10'
    if (trend === 'down') return 'bg-red-500/10'
    return 'bg-blue-500/10'
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <div className={`p-2 rounded-lg ${getBgColor()}`}>
          <div className={getTrendColor()}>{icon}</div>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-slate-100">{value}</p>
        </div>
        
        {change && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend === 'down' ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricsCard