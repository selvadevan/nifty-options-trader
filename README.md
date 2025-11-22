# NIFTY Options Trader

🚀 A full-stack web application for algo trading NIFTY derivatives with a focus on options selling strategies.

## Overview

This application is designed for **positional traders** with a 30-45 day trading horizon who prefer selling options over buying. Built with Flask backend and React frontend, it provides a complete solution for automated NIFTY options trading with comprehensive risk management.

## Features

✅ **Modern React Dashboard**
- Real-time position monitoring with auto-refresh
- Live P&L charts with Recharts visualization
- One-click strategy execution
- Risk alerts for stop-loss triggers
- Responsive design (desktop, tablet, mobile)
- Dark theme optimized for trading

✅ **Broker Integration**
- Support for multiple Indian brokers (Zerodha, Angel One, Upstox, Kotak)
- Unified API interface for seamless broker switching
- Real-time quote and order management

✅ **Options Chain Analysis**
- Automatic expiry detection (30-45 days)
- Complete options chain fetching with Greeks
- Smart candidate selection for option selling

✅ **Strategy Execution**
- Automated put selling strategy
- Position sizing based on capital
- Multi-strike deployment

✅ **Risk Management**
- Real-time position monitoring
- Stop-loss alerts (30% of premium)
- P&L tracking and analytics

✅ **REST API**
- Clean RESTful endpoints
- Real-time data updates
- Comprehensive error handling

## Project Structure

```
nifty-options-trader/
├── app/                     # Flask Backend
│   ├── __init__.py          # Application factory
│   ├── config.py            # Configuration
│   ├── routes/
│   │   ├── api.py          # Main API endpoints
│   │   ├── orders.py       # Order management
│   │   └── analytics.py    # Analytics & monitoring
│   ├── services/
│   │   ├── broker.py       # Broker integration
│   │   ├── options.py      # Options chain handler
│   │   └── strategy.py     # Strategy execution
│   └── utils/
│       └── greeks.py       # Greeks calculation
├── frontend/                # React Dashboard
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── App.jsx         # Main app
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── requirements.txt
├── .env.example
└── run.py
```

## Quick Start

### Backend Setup (Flask)

1. **Clone the repository**
```bash
git clone https://github.com/selvadevan/nifty-options-trader.git
cd nifty-options-trader
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your broker credentials
```

5. **Run Flask backend**
```bash
python run.py
```

Backend will run on `http://localhost:5000`

### Frontend Setup (React)

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

Dashboard will be available at `http://localhost:3000`

4. **Build for production** (optional)
```bash
npm run build
```

## Configuration

Edit `.env` file with your settings:

```env
# Broker Configuration
BROKER_API_KEY=your_api_key
BROKER_API_SECRET=your_api_secret
BROKER_NAME=zerodha  # Options: zerodha, angelone, upstox, kotak

# Trading Parameters
MAX_POSITIONS=5
DEFAULT_LOT_SIZE=50
RISK_PER_TRADE=2
```

## Dashboard Features

### Real-time Metrics
- **Total P&L**: Combined realized + unrealized profit/loss
- **Active Positions**: Number of open positions
- **Realized P&L**: Closed position profits
- **Unrealized P&L**: Open position MTM

### Live P&L Chart
- Updates every 3 seconds
- Shows total, realized, and unrealized P&L
- Interactive tooltips with values
- Keeps last 100 data points

### Positions Table
- Symbol, strike, quantity, and prices
- Color-coded P&L (green profit, red loss)
- Auto-refreshes every 5 seconds
- Shows transaction type (BUY/SELL)

### Risk Alerts
- Automatic alerts when stop-loss hit (30% loss)
- Shows affected symbols and loss percentage
- Dismissable notifications
- Checks every 10 seconds

### Strategy Execution
- Modal interface for deploying capital
- Select number of strikes (1-5)
- Shows strategy details before execution
- Real-time execution feedback

## API Endpoints

### Health Check
```bash
GET /api/health
```

### Get Available Expiries
```bash
GET /api/expiries?min_days=30&max_days=45
```

### Get Options Chain
```bash
GET /api/options-chain/<expiry>
```

### Execute Strategy
```bash
POST /api/orders/strategy/execute
Content-Type: application/json

{
  "capital": 100000,
  "target_strikes": 3
}
```

### Get Positions
```bash
GET /api/orders/positions
```

### Monitor Positions
```bash
GET /api/analytics/positions/monitor
```

### Get P&L Summary
```bash
GET /api/analytics/pnl/summary
```

## Usage Example

### Using the Dashboard (Recommended)

1. Start Flask backend: `python run.py`
2. Start React frontend: `cd frontend && npm run dev`
3. Open browser to `http://localhost:3000`
4. Click "Execute Strategy" button
5. Enter capital and number of strikes
6. Monitor positions in real-time

### Using API Directly

```python
import requests

# Execute Strategy
response = requests.post(
    'http://localhost:5000/api/orders/strategy/execute',
    json={
        'capital': 100000,
        'target_strikes': 3
    }
)
print(response.json())

# Monitor Positions
response = requests.get('http://localhost:5000/api/analytics/positions/monitor')
analysis = response.json()['analysis']
print(f"Total P&L: ₹{analysis['total_pnl']}")
```

## Trading Strategy

### Put Selling Strategy (30-45 Days)

**Philosophy**: Collect premium by selling OTM puts on NIFTY with 30-45 days to expiry, capitalizing on time decay (theta).

**Entry Criteria**:
- Expiry: 30-45 days out (weekly NIFTY expiries)
- Strike Selection: OTM puts with minimum ₹100 premium
- Position Sizing: Based on available capital
- Max Positions: 3-5 strikes simultaneously

**Risk Management**:
- Stop Loss: 30% of premium received
- Max Loss per Position: ₹10,000
- Product Type: NRML (for positional trading)

**Exit Strategy**:
- Target: 50-70% profit (exit when premium decays)
- Time Exit: Close 5-7 days before expiry
- Stop Loss: Automatic monitoring and alerts

## Technology Stack

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-SocketIO** - WebSocket support
- **pandas/numpy** - Data analysis
- **scipy** - Greeks calculation

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts and visualization
- **Axios** - HTTP client
- **Lucide React** - Icons

## Risk Disclaimer

⚠️ **Important**: 
- This software is for educational purposes
- Options trading involves substantial risk
- Past performance doesn't guarantee future results
- Always test strategies in paper trading first
- Consult a financial advisor before trading

## Broker API Setup

### Zerodha Kite
1. Sign up at [kite.trade](https://kite.trade)
2. Create an app and get API credentials
3. Install kiteconnect: `pip install kiteconnect`

### Angel One
1. Register at [angelone.in](https://www.angelone.in)
2. Generate API key from API section
3. Use SmartAPI for integration

### Upstox
1. Get API access from [upstox.com](https://upstox.com)
2. Create app and obtain credentials

## Development

### Backend Development
```bash
# Run with auto-reload
python run.py

# Run tests
pytest tests/

# Code formatting
black app/
flake8 app/
```

### Frontend Development
```bash
cd frontend

# Development server
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## Production Deployment

### Backend
```bash
# Use gunicorn for production
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### Frontend
```bash
cd frontend
npm run build
# Serve dist/ folder with nginx or similar
```

## Screenshots

*Dashboard coming soon...*

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/selvadevan/nifty-options-trader/issues)
- Email: Check profile for contact

## Roadmap

- [x] Flask REST API backend
- [x] React dashboard frontend
- [x] Real-time position monitoring
- [x] Live P&L charts
- [x] Risk alerts system
- [ ] Real-time WebSocket streaming
- [ ] Backtesting module
- [ ] Telegram/Email alerts
- [ ] Multi-strategy support
- [ ] Database integration for trade history
- [ ] Advanced Greeks monitoring
- [ ] AI-powered entry/exit signals
- [ ] Mobile app version

## Acknowledgments

- Flask framework
- React and Vite
- Recharts library
- Tailwind CSS
- Indian broker APIs (Zerodha, Angel One, etc.)
- Python trading community

---

**Built with ❤️ for NIFTY Options Traders**

*Happy Trading! 📈*