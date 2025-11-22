import React from 'react'
import { LayoutGrid, TrendingUp, Target } from 'lucide-react'

const Navigation = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'holdings', label: 'Holdings', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'positions', label: 'Positions', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'strategy', label: 'Strategy', icon: <Target className="w-5 h-5" /> }
  ]

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700">
      <div className="flex items-center">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-all ${
              activeView === item.id
                ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            } ${
              item.id === menuItems[0].id ? 'rounded-l-xl' : ''
            } ${
              item.id === menuItems[menuItems.length - 1].id ? 'rounded-r-xl' : ''
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Navigation