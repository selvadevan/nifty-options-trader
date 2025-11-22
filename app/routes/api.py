from flask import Blueprint, jsonify, request
from app.services.broker import BrokerService
from app.services.options import OptionsChainService
from app.services.strategy import StrategyService
from app.config import Config
import logging

api_bp = Blueprint('api', __name__)
config = Config()
logger = logging.getLogger(__name__)

# Initialize services (in production, use dependency injection)
broker = BrokerService(config.BROKER_API_KEY, config.BROKER_API_SECRET)
options = OptionsChainService(broker)
strategy = StrategyService(broker, options)

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'NIFTY Options Trader API'
    })

@api_bp.route('/login', methods=['POST'])
def login():
    """Broker login endpoint"""
    data = request.get_json()
    request_token = data.get('request_token')
    
    success = broker.login(request_token)
    
    return jsonify({
        'success': success,
        'message': 'Login successful' if success else 'Login failed'
    })

@api_bp.route('/options-chain/<expiry>', methods=['GET'])
def get_options_chain(expiry):
    """Get complete options chain"""
    try:
        chain = options.get_options_chain(expiry)
        
        return jsonify({
            'success': True,
            'data': chain.to_dict('records')
        })
    except Exception as e:
        logger.error(f"Options chain fetch failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@api_bp.route('/expiries', methods=['GET'])
def get_expiries():
    """Get available expiries for strategy"""
    min_days = request.args.get('min_days', 30, type=int)
    max_days = request.args.get('max_days', 45, type=int)
    
    expiries = options.get_nifty_expiries(min_days, max_days)
    
    return jsonify({
        'success': True,
        'expiries': expiries
    })

@api_bp.route('/quote/<symbol>', methods=['GET'])
def get_quote(symbol):
    """Get real-time quote"""
    exchange = request.args.get('exchange', 'NFO')
    quote = broker.get_quote(symbol, exchange)
    
    if quote:
        return jsonify({
            'success': True,
            'data': quote
        })
    
    return jsonify({
        'success': False,
        'error': 'Quote not available'
    }), 404