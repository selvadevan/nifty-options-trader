import React from 'react'
import { TrendingUp, Play, RefreshCw } from 'lucide-react'

const Header = ({ onExecuteStrategy }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">NIFTY Options Trader</h1>
              <p className="text-sm text-slate-400">30-45 Day Put Selling Strategy</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onExecuteStrategy}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Execute Strategy</span>
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header