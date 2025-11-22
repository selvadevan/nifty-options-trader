# NIFTY Options Trader - React Dashboard

📊 Modern React dashboard for monitoring and executing NIFTY options trading strategies.

## Features

✅ **Real-time Position Monitoring** - Track all active positions with live P&L updates
✅ **Live P&L Chart** - Visualize your profit/loss in real-time with Recharts
✅ **Risk Alerts** - Automatic stop-loss alerts when positions hit 30% loss
✅ **Strategy Execution** - One-click execution of put selling strategy
✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
✅ **Dark Theme** - Easy on the eyes for long trading sessions

## Tech Stack

- **React 18** - UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Beautiful responsive charts
- **Axios** - HTTP client for API calls
- **Lucide React** - Modern icon library
- **date-fns** - Date formatting utilities

## Installation

### Prerequisites
- Node.js 18+ and npm
- Backend Flask API running on `http://localhost:5000`

### Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

4. **Build for production**
```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Top navigation bar
│   │   ├── MetricsCard.jsx      # KPI metric cards
│   │   ├── PositionsTable.jsx   # Active positions table
│   │   ├── LivePNLChart.jsx     # Real-time P&L chart
│   │   ├── StrategyCard.jsx     # Strategy execution modal
│   │   └── RiskAlerts.jsx       # Stop-loss alerts
│   ├── hooks/
│   │   ├── usePositions.js      # Fetch positions data
│   │   ├── usePNL.js            # Fetch P&L data
│   │   └── useWebSocket.js      # WebSocket connection
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Components Overview

### Header
Top navigation with branding and action buttons for executing strategy and refreshing data.

### MetricsCard
Displays key metrics:
- Total P&L
- Active Positions Count
- Realized P&L
- Unrealized P&L

### PositionsTable
Shows all active positions with:
- Symbol, Type (BUY/SELL)
- Quantity, Average Price, LTP
- P&L in ₹ and percentage
- Color-coded for profit/loss

### LivePNLChart
Real-time line chart showing:
- Total P&L (blue)
- Realized P&L (green)
- Unrealized P&L (orange)
- Updates every 3 seconds

### StrategyCard
Modal for executing put selling strategy:
- Input capital amount
- Select number of strikes (1-5)
- Shows strategy details
- Displays execution results

### RiskAlerts
Automatic alerts for positions hitting stop-loss (30% of premium):
- Shows symbol and loss percentage
- Recommended action
- Dismissable alerts

## Custom Hooks

### usePositions
Fetches positions from `/api/orders/positions` every 5 seconds.

```javascript
const { positions, loading, error, refetch } = usePositions()
```

### usePNL
Fetches P&L summary from `/api/analytics/pnl/summary` every 3 seconds and builds chart data.

```javascript
const { pnlData, summary, loading } = usePNL()
```

### useWebSocket
WebSocket connection for real-time updates (future enhancement).

```javascript
const { data, isConnected, sendMessage } = useWebSocket('ws://localhost:5000')
```

## API Integration

The dashboard connects to your Flask backend via proxy (configured in `vite.config.js`):

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

All API calls use relative paths like `/api/orders/positions`.

## Styling

### Tailwind CSS
Utility-first CSS framework for rapid UI development.

### Color Scheme
- Background: Slate 900/800 (dark theme)
- Text: Slate 100/300
- Accent: Blue 600
- Success: Green 500
- Danger: Red 500
- Warning: Orange 500

### Custom Classes
Defined in `index.css` for custom scrollbar styling.

## Performance Optimizations

- **Polling Intervals**: Positions (5s), P&L (3s), Risk Alerts (10s)
- **Data Limiting**: Chart keeps last 100 data points
- **Lazy Loading**: Components load on demand
- **Memoization**: Can be added for heavy computations

## Development Tips

### Hot Module Replacement (HMR)
Vite provides instant updates without full page reload during development.

### Debugging
Use React DevTools browser extension for component inspection.

### API Testing
Test backend APIs independently before integrating:
```bash
curl http://localhost:5000/api/health
```

## Production Deployment

### Build
```bash
npm run build
```

Generates optimized static files in `dist/` directory.

### Serve
Serve with any static file server:
```bash
npm install -g serve
serve -s dist
```

Or integrate with Flask by serving from `static/` directory.

## Future Enhancements

- [ ] WebSocket integration for instant updates
- [ ] Options chain viewer
- [ ] Greeks calculator display
- [ ] Historical trade log
- [ ] Backtesting results visualization
- [ ] Mobile app version
- [ ] Dark/Light theme toggle
- [ ] Customizable dashboard layout

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### API Connection Issues
Ensure Flask backend is running on port 5000:
```bash
cd .. # Navigate to project root
python run.py
```

### Build Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Support

For issues or questions:
- Check backend logs for API errors
- Review browser console for frontend errors
- Ensure all dependencies are installed

---

**Happy Trading! 🚀**