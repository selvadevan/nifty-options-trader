from flask import Blueprint, jsonify
from app.services.strategy import StrategyService
from app.services.broker import BrokerService
from app.services.options import OptionsChainService
from app.config import Config

analytics_bp = Blueprint('analytics', __name__)
config = Config()

@analytics_bp.route('/positions/monitor', methods=['GET'])
def monitor_positions():
    """Monitor all positions with risk analysis"""
    broker = BrokerService(config.BROKER_API_KEY, config.BROKER_API_SECRET)
    options_service = OptionsChainService(broker)
    strategy_service = StrategyService(broker, options_service)
    
    analysis = strategy_service.monitor_positions()
    
    return jsonify({
        'success': True,
        'analysis': analysis
    })

@analytics_bp.route('/pnl/summary', methods=['GET'])
def pnl_summary():
    """Get P&L summary"""
    broker = BrokerService(config.BROKER_API_KEY, config.BROKER_API_SECRET)
    positions = broker.get_positions()
    
    total_pnl = sum(pos.get('pnl', 0) for pos in positions)
    realized_pnl = sum(pos.get('realised', 0) for pos in positions)
    unrealized_pnl = sum(pos.get('unrealised', 0) for pos in positions)
    
    return jsonify({
        'success': True,
        'data': {
            'total_pnl': total_pnl,
            'realized_pnl': realized_pnl,
            'unrealized_pnl': unrealized_pnl,
            'positions_count': len(positions)
        }
    })