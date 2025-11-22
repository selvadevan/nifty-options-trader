import React, { useState } from 'react'

function TradeActions({ niftyPrice, actions, setActions }) {
  const [sellStrike, setSellStrike] = useState(0)
  const [buyStrike, setBuyStrike] = useState(0)
  const [tradeType, setTradeType] = useState('PUT')

  const addAction = () => {
    setActions([...actions, {
      action: tradeType,
      sellStrike,
      buyStrike,
      niftyPrice
    }])
    setSellStrike(0)
    setBuyStrike(0)
  }

  return (
    <div className="p-6 bg-slate-800/60 rounded-xl border border-slate-700 shadow-xl">
      <h3 className="text-lg font-bold text-slate-100 mb-2">Define Trade Action</h3>
      <div className="mb-4 flex gap-8 items-end">
        <div>
          <label className="block text-slate-300">Trade Type</label>
          <select 
            className="w-full px-4 py-2 rounded bg-slate-100 border border-slate-400"
            value={tradeType}
            onChange={e => setTradeType(e.target.value)}
          >
            <option value="PUT">SELL PUT (Short Put)</option>
            <option value="CALL">SELL CALL (Short Call)</option>
            <option value="BUY PUT">BUY PUT</option>
            <option value="BUY CALL">BUY CALL</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-300">Sell Strike</label>
          <input
            type="number"
            className="w-32 px-3 py-2 rounded bg-slate-100 border border-slate-400"
            value={sellStrike}
            onChange={e => setSellStrike(Number(e.target.value))}
            placeholder="Strike price"
          />
        </div>
        <div>
          <label className="block text-slate-300">Buy Strike</label>
          <input
            type="number"
            className="w-32 px-3 py-2 rounded bg-slate-100 border border-slate-400"
            value={buyStrike}
            onChange={e => setBuyStrike(Number(e.target.value))}
            placeholder="Strike price"
          />
        </div>
        <button
          className="mt-5 px-5 py-2 bg-blue-600 text-white rounded font-semibold"
          onClick={addAction}
        >Add Action</button>
      </div>

      <div className="mt-8">
        <h4 className="text-base font-semibold text-slate-200 mb-3">Actions Queue</h4>
        <ul>
          {actions.map((act, idx) => (
            <li
              key={idx}
              className="mb-2 bg-slate-700 rounded px-3 py-2 text-slate-300 flex justify-between items-center"
            >
              <span>
                NIFTY {act.niftyPrice} | {act.action} | Sell {act.sellStrike} | Buy {act.buyStrike}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default TradeActions
