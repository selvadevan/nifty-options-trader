import React from 'react'
import PositionsTable from './PositionsTable'
import LivePNLChart from './LivePNLChart'

const PositionsView = ({ positions, loading, error, pnlData, pnlLoading }) => {
  return (
    <>
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
          loading={loading} 
          error={error} 
        />
      </div>
    </>
  )
}

export default PositionsView