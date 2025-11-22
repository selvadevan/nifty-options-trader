from flask import Blueprint, jsonify, request
from app.services.broker import BrokerService
from app.services.strategy import StrategyService
from app.services.options import OptionsChainService
from app.config import Config
import logging

orders_bp = Blueprint('orders', __name__)
config = Config()
logger = logging.getLogger(__name__)

@orders_bp.route('/place', methods=['POST'])
def place_order():
    """Place a single order"""
    data = request.get_json()
    
    # Validate request data
    required_fields = ['symbol', 'transaction_type', 'quantity']
    if not all(field in data for field in required_fields):
        return jsonify({
            'success': False,
            'error': 'Missing required fields'
        }), 400
    
    # Initialize broker (in production, get from session/context)
    broker = BrokerService(config.BROKER_API_KEY, config.BROKER_API_SECRET)
    
    order_id = broker.place_order(
        symbol=data['symbol'],
        transaction_type=data['transaction_type'],
        quantity=data['quantity'],
        price=data.get('price'),
        order_type=data.get('order_type', 'LIMIT'),
        product=data.get('product', 'NRML')
    )
    
    if order_id:
        return jsonify({
            'success': True,
            'order_id': order_id,
            'message': 'Order placed successfully'
        })
    
    return jsonify({
        'success': False,
        'error': 'Order placement failed'
    }), 500

@orders_bp.route('/positions', methods=['GET'])
def get_positions():
    """Get all open positions"""
    broker = BrokerService(config.BROKER_API_KEY, config.BROKER_API_SECRET)
    positions = broker.get_positions()
    
    return jsonify({
        'success': True,
        'data': positions
    })

@orders_bp.route('/strategy/execute', methods=['POST'])
def execute_strategy():
    """Execute the put selling strategy"""
    data = request.get_json()
    capital = data.get('capital', 100000)  # Default 1L
    target_strikes = data.get('target_strikes', 3)
    
    broker = BrokerService(config.BROKER_API_KEY, config.BROKER_API_SECRET)
    options_service = OptionsChainService(broker)
    strategy_service = StrategyService(broker, options_service)
    
    result = strategy_service.execute_put_selling_strategy(
        capital=capital,
        target_strikes=target_strikes
    )
    
    return jsonify(result)