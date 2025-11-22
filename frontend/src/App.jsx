import React, { useState } from 'react'
import { TrendingUp, Activity, DollarSign, AlertTriangle } from 'lucide-react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import PositionsView from './components/PositionsView'
import HoldingsView from './components/HoldingsView'
import StrategyView from './components/StrategyView'
import MetricsCard from './components/MetricsCard'
import RiskAlerts from './components/RiskAlerts'
import { usePositions } from './hooks/usePositions'
import { usePNL } from './hooks/usePNL'

function App() {
  const [activeView, setActiveView] = useState('positions') // 'holdings', 'positions', 'strategy'
  const { positions, loading: positionsLoading, error: positionsError } = usePositions()
  const { pnlData, summary, loading: pnlLoading } = usePNL()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
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

        {/* Navigation Menu */}
        <Navigation activeView={activeView} setActiveView={setActiveView} />

        {/* Conditional Views Based on Active Tab */}
        {activeView === 'holdings' && <HoldingsView />}
        {activeView === 'positions' && (
          <PositionsView 
            positions={positions}
            loading={positionsLoading}
            error={positionsError}
            pnlData={pnlData}
            pnlLoading={pnlLoading}
          />
        )}
        {activeView === 'strategy' && <StrategyView />}
      </main>
    </div>
  )
}

export default App