from datetime import datetime, timedelta
from typing import List, Dict, Optional
import pandas as pd
import numpy as np

class OptionsChainService:
    """Handle NIFTY options chain data and analysis"""
    
    def __init__(self, broker_service):
        self.broker = broker_service
        
    def get_nifty_expiries(self, 
                          min_days: int = 30, 
                          max_days: int = 45) -> List[str]:
        """Get NIFTY expiry dates within target range"""
        # NIFTY weekly expiries are on Thursdays
        today = datetime.now()
        expiries = []
        
        # Check next 8 weeks for target expiry
        for weeks in range(1, 9):
            expiry_date = today + timedelta(weeks=weeks)
            # Find next Thursday
            days_ahead = 3 - expiry_date.weekday()  # 3 = Thursday
            if days_ahead < 0:
                days_ahead += 7
            expiry_date = expiry_date + timedelta(days=days_ahead)
            
            days_to_expiry = (expiry_date - today).days
            
            if min_days <= days_to_expiry <= max_days:
                expiries.append(expiry_date.strftime('%d%b%y').upper())
        
        return expiries
    
    def get_options_chain(self, expiry: str) -> pd.DataFrame:
        """Fetch complete options chain for given expiry"""
        # Get NIFTY spot price
        spot_data = self.broker.get_quote('NIFTY 50', 'NSE')
        if not spot_data:
            return pd.DataFrame()
        
        spot_price = spot_data['last_price']
        
        # Generate strike range (±10% from spot)
        strikes = self._generate_strikes(spot_price)
        
        chain_data = []
        
        for strike in strikes:
            # Fetch CE (Call) data
            ce_symbol = f"NIFTY{expiry}{strike}CE"
            ce_data = self.broker.get_quote(ce_symbol)
            
            # Fetch PE (Put) data
            pe_symbol = f"NIFTY{expiry}{strike}PE"
            pe_data = self.broker.get_quote(pe_symbol)
            
            if ce_data and pe_data:
                chain_data.append({
                    'strike': strike,
                    'ce_ltp': ce_data.get('last_price', 0),
                    'ce_volume': ce_data.get('volume', 0),
                    'ce_oi': ce_data.get('oi', 0),
                    'ce_bid': ce_data.get('depth', {}).get('buy', [{}])[0].get('price', 0),
                    'ce_ask': ce_data.get('depth', {}).get('sell', [{}])[0].get('price', 0),
                    'pe_ltp': pe_data.get('last_price', 0),
                    'pe_volume': pe_data.get('volume', 0),
                    'pe_oi': pe_data.get('oi', 0),
                    'pe_bid': pe_data.get('depth', {}).get('buy', [{}])[0].get('price', 0),
                    'pe_ask': pe_data.get('depth', {}).get('sell', [{}])[0].get('price', 0)
                })
        
        df = pd.DataFrame(chain_data)
        df['spot_price'] = spot_price
        df['expiry'] = expiry
        
        return df
    
    def _generate_strikes(self, spot_price: float, 
                         range_percent: float = 10) -> List[int]:
        """Generate option strikes around spot price"""
        # NIFTY strikes are in multiples of 50
        lower = int((spot_price * (1 - range_percent/100)) / 50) * 50
        upper = int((spot_price * (1 + range_percent/100)) / 50) * 50
        
        return list(range(lower, upper + 50, 50))
    
    def find_selling_candidates(self, 
                               chain: pd.DataFrame,
                               option_type: str = 'PE',
                               min_premium: float = 100) -> pd.DataFrame:
        """Find best options to sell based on your strategy"""
        
        if option_type == 'PE':
            # For Put selling - look for OTM puts with good premium
            candidates = chain[chain['pe_ltp'] >= min_premium].copy()
            candidates['premium'] = candidates['pe_ltp']
            candidates['oi'] = candidates['pe_oi']
            candidates['distance'] = chain['spot_price'] - candidates['strike']
        else:
            # For Call selling
            candidates = chain[chain['ce_ltp'] >= min_premium].copy()
            candidates['premium'] = candidates['ce_ltp']
            candidates['oi'] = candidates['ce_oi']
            candidates['distance'] = candidates['strike'] - chain['spot_price']
        
        # Sort by premium/risk ratio
        candidates = candidates.sort_values('premium', ascending=False)
        
        return candidates[['strike', 'premium', 'oi', 'distance']]