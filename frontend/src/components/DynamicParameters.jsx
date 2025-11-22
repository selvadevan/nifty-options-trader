import React from 'react'

function DynamicParameters({ value, onChange }) {
  return (
    <div className="mb-10 p-6 bg-slate-800/60 rounded-xl border border-slate-700 shadow-xl">
      <label className="block text-lg font-semibold text-slate-100 mb-2">Enter NIFTY Spot Price</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        placeholder="Example: 19785"
        className="w-full px-4 py-3 text-xl text-slate-900 bg-slate-300 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  )
}
export default DynamicParameters
