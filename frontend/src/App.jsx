import React, { useState } from 'react'
import { TrendingUp, Activity, DollarSign, AlertTriangle } from 'lucide-react'
import Header from './components/Header'
import PositionsTable from './components/PositionsTable'
import LivePNLChart from './components/LivePNLChart'
import StrategyCard from './components/StrategyCard'
import MetricsCard from './components/MetricsCard'
import RiskAlerts from './components/RiskAlerts'
import { usePositions } from './hooks/usePositions'
import { usePNL } from './hooks/usePNL'

function App() {
  const { positions, loading: positionsLoading, error: positionsError } = usePositions()
  const { pnlData, summary, loading: pnlLoading } = usePNL()
  const [showStrategyModal, setShowStrategyModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header onExecuteStrategy={() => setShowStrategyModal(true)} />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="Total P&L"
            value={`₹${summary?.total_pnl?.toLocaleString('en-IN') || '0'}`}
            change={summary?.total_pnl >= 0 ? '+' : '-'}
            icon={<DollarSign className="w-6 h-6" />}
            trend={summary?.total_pnl >= 0 ? 'up' : 'down'}
          />
          <MetricsCard
            title="Active Positions"
            value={positions?.length || 0}
            icon={<Activity className="w-6 h-6" />}
            trend="neutral"
          />
          <MetricsCard
            title="Realized P&L"
            value={`₹${summary?.realized_pnl?.toLocaleString('en-IN') || '0'}`}
            icon={<TrendingUp className="w-6 h-6" />}
            trend={summary?.realized_pnl >= 0 ? 'up' : 'down'}
          />
          <MetricsCard
            title="Unrealized P&L"
            value={`₹${summary?.unrealized_pnl?.toLocaleString('en-IN') || '0'}`}
            icon={<AlertTriangle className="w-6 h-6" />}
            trend={summary?.unrealized_pnl >= 0 ? 'up' : 'down'}
          />
        </div>

        {/* Risk Alerts */}
        <RiskAlerts />

        {/* Live P&L Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-slate-100">Live P&L Tracker</h2>
          <LivePNLChart data={pnlData} loading={pnlLoading} />
        </div>

        {/* Positions Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-slate-100">Active Positions</h2>
          <PositionsTable 
            positions={positions} 
            loading={positionsLoading} 
            error={positionsError} 
          />
        </div>

        {/* Strategy Execution Modal */}
        {showStrategyModal && (
          <StrategyCard onClose={() => setShowStrategyModal(false)} />
        )}
      </main>
    </div>
  )
}

export default App