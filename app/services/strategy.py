from typing import Dict, Optional
from app.config import Config
import logging

logger = logging.getLogger(__name__)

class StrategyService:
    """Execute options selling strategies"""
    
    def __init__(self, broker_service, options_service):
        self.broker = broker_service
        self.options = options_service
        self.config = Config()
        
    def execute_put_selling_strategy(self, 
                                     capital: float,
                                     target_strikes: int = 3) -> Dict:
        """
        Execute 30-45 day put selling strategy
        Sells OTM puts on NIFTY based on your trading style
        """
        results = {
            'status': 'initiated',
            'orders': [],
            'errors': []
        }
        
        try:
            # Step 1: Get target expiries (30-45 days)
            expiries = self.options.get_nifty_expiries(
                min_days=self.config.EXPIRY_DAYS_MIN,
                max_days=self.config.EXPIRY_DAYS_MAX
            )
            
            if not expiries:
                results['status'] = 'failed'
                results['errors'].append('No suitable expiry found')
                return results
            
            target_expiry = expiries[0]  # First available expiry
            
            # Step 2: Get options chain
            chain = self.options.get_options_chain(target_expiry)
            
            if chain.empty:
                results['status'] = 'failed'
                results['errors'].append('Options chain not available')
                return results
            
            # Step 3: Find selling candidates
            candidates = self.options.find_selling_candidates(
                chain, 
                option_type='PE',
                min_premium=100
            )
            
            # Step 4: Calculate position sizing
            capital_per_trade = capital / target_strikes
            
            # Step 5: Place orders for top candidates
            for idx, row in candidates.head(target_strikes).iterrows():
                strike = int(row['strike'])
                premium = row['premium']
                
                # Calculate quantity based on capital
                margin_required = premium * self.config.NIFTY_LOT_SIZE
                quantity = int(capital_per_trade / margin_required) * self.config.NIFTY_LOT_SIZE
                
                if quantity >= self.config.NIFTY_LOT_SIZE:
                    symbol = f"NIFTY{target_expiry}{strike}PE"
                    
                    order_id = self.broker.place_order(
                        symbol=symbol,
                        transaction_type='SELL',
                        quantity=quantity,
                        order_type='MARKET',
                        product='NRML'  # Normal for positional trading
                    )
                    
                    if order_id:
                        results['orders'].append({
                            'order_id': order_id,
                            'symbol': symbol,
                            'strike': strike,
                            'quantity': quantity,
                            'premium': premium,
                            'expiry': target_expiry
                        })
                    else:
                        results['errors'].append(f'Failed to place order for {strike}PE')
            
            results['status'] = 'completed' if results['orders'] else 'failed'
            
        except Exception as e:
            logger.error(f"Strategy execution failed: {e}")
            results['status'] = 'error'
            results['errors'].append(str(e))
        
        return results
    
    def monitor_positions(self) -> Dict:
        """Monitor and manage open positions"""
        positions = self.broker.get_positions()
        
        analysis = {
            'total_positions': len(positions),
            'total_pnl': 0,
            'positions_at_risk': [],
            'recommendations': []
        }
        
        for position in positions:
            pnl = position.get('pnl', 0)
            analysis['total_pnl'] += pnl
            
            # Check if stop loss hit (30% of premium)
            if pnl < 0:
                loss_percent = abs(pnl / position['buy_value']) * 100
                
                if loss_percent >= self.config.STOP_LOSS_PERCENT:
                    analysis['positions_at_risk'].append({
                        'symbol': position['tradingsymbol'],
                        'loss_percent': loss_percent,
                        'action': 'CLOSE_IMMEDIATELY'
                    })
        
        return analysis