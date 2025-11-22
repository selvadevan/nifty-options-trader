import React, { useState } from 'react'
import DynamicParameters from './components/DynamicParameters'
import TradeActions from './components/TradeActions'

function App() {
  const [niftyPrice, setNiftyPrice] = useState(0)
  const [actions, setActions] = useState([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <main className="container mx-auto px-4 py-16 space-y-16">
        <div className="max-w-2xl mx-auto">
          <DynamicParameters 
            value={niftyPrice}
            onChange={setNiftyPrice}
          />
          <TradeActions 
            niftyPrice={niftyPrice}
            actions={actions}
            setActions={setActions}
          />
        </div>
      </main>
    </div>
  )
}
export default App
