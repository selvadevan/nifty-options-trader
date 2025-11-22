# NIFTY Options Trader

🚀 A custom Flask web application for algo trading NIFTY derivatives with a focus on options selling strategies.

## Overview

This application is designed for **positional traders** with a 30-45 day trading horizon who prefer selling options over buying. Built with Flask, it provides a robust API for automated NIFTY options trading with comprehensive risk management.

## Features

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
- Real-time WebSocket support
- Comprehensive error handling

## Project Structure

```
nifty-options-trader/
├── app/
│   ├── __init__.py          # Application factory
│   ├── config.py            # Configuration
│   ├── models/              # Data models
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
├── requirements.txt
├── .env.example
├── .gitignore
└── run.py
```

## Installation

### Prerequisites

- Python 3.8+
- pip
- Virtual environment (recommended)

### Setup

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

5. **Run the application**
```bash
python run.py
```

The API will be available at `http://localhost:5000`

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

### Monitor Positions
```bash
GET /api/analytics/positions/monitor
```

### Get P&L Summary
```bash
GET /api/analytics/pnl/summary
```

## Usage Example

### 1. Login to Broker
```python
import requests

response = requests.post('http://localhost:5000/api/login', json={
    'request_token': 'your_request_token'
})
print(response.json())
```

### 2. Execute Put Selling Strategy
```python
response = requests.post(
    'http://localhost:5000/api/orders/strategy/execute',
    json={
        'capital': 100000,  # 1 Lakh capital
        'target_strikes': 3  # Sell 3 different strikes
    }
)
print(response.json())
```

### 3. Monitor Your Positions
```python
response = requests.get('http://localhost:5000/api/analytics/positions/monitor')
analysis = response.json()['analysis']

print(f"Total P&L: {analysis['total_pnl']}")
print(f"Positions at Risk: {len(analysis['positions_at_risk'])}")
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

### Running Tests
```bash
pytest tests/
```

### Code Style
```bash
flake8 app/
black app/
```

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

- [ ] Frontend dashboard with React
- [ ] Real-time WebSocket streaming
- [ ] Backtesting module
- [ ] Telegram/Email alerts
- [ ] Multi-strategy support
- [ ] Database integration for trade history
- [ ] Advanced Greeks monitoring
- [ ] AI-powered entry/exit signals

## Acknowledgments

- Flask framework
- Indian broker APIs (Zerodha, Angel One, etc.)
- Python trading community

---

**Built with ❤️ for NIFTY Options Traders**

*Happy Trading! 📈*