import requests
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class BrokerService:
    """Unified broker interface for Indian brokers"""
    
    def __init__(self, api_key: str, api_secret: str, broker: str = 'zerodha'):
        self.api_key = api_key
        self.api_secret = api_secret
        self.broker = broker
        self.access_token = None
        self.base_url = self._get_base_url()
        
    def _get_base_url(self) -> str:
        """Get broker-specific base URL"""
        urls = {
            'zerodha': 'https://api.kite.trade',
            'angelone': 'https://apiconnect.angelbroking.com',
            'upstox': 'https://api.upstox.com/v2',
            'kotak': 'https://gw-napi.kotaksecurities.com'
        }
        return urls.get(self.broker, '')
    
    def login(self, request_token: str = None) -> bool:
        """Authenticate with broker API"""
        try:
            # Implementation varies by broker
            # Example for Zerodha
            if self.broker == 'zerodha':
                from kiteconnect import KiteConnect
                kite = KiteConnect(api_key=self.api_key)
                data = kite.generate_session(request_token, 
                                            api_secret=self.api_secret)
                self.access_token = data['access_token']
                return True
        except Exception as e:
            logger.error(f"Login failed: {e}")
            return False
    
    def get_quote(self, symbol: str, exchange: str = 'NFO') -> Optional[Dict]:
        """Get real-time quote for options"""
        try:
            headers = {
                'Authorization': f'token {self.api_key}:{self.access_token}',
                'X-Kite-Version': '3'
            }
            
            url = f"{self.base_url}/quote"
            params = {'i': f'{exchange}:{symbol}'}
            
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            
            return response.json()['data'][f'{exchange}:{symbol}']
            
        except Exception as e:
            logger.error(f"Quote fetch failed: {e}")
            return None
    
    def place_order(self, 
                   symbol: str,
                   transaction_type: str,  # BUY or SELL
                   quantity: int,
                   price: float = None,
                   order_type: str = 'LIMIT',
                   product: str = 'NRML') -> Optional[str]:
        """Place option order"""
        try:
            headers = {
                'Authorization': f'token {self.api_key}:{self.access_token}',
                'Content-Type': 'application/json'
            }
            
            order_data = {
                'tradingsymbol': symbol,
                'exchange': 'NFO',
                'transaction_type': transaction_type,
                'order_type': order_type,
                'quantity': quantity,
                'product': product,
                'validity': 'DAY'
            }
            
            if price and order_type == 'LIMIT':
                order_data['price'] = price
            
            url = f"{self.base_url}/orders"
            response = requests.post(url, json=order_data, headers=headers)
            response.raise_for_status()
            
            return response.json()['data']['order_id']
            
        except Exception as e:
            logger.error(f"Order placement failed: {e}")
            return None
    
    def get_positions(self) -> List[Dict]:
        """Get current positions"""
        try:
            headers = {
                'Authorization': f'token {self.api_key}:{self.access_token}'
            }
            
            url = f"{self.base_url}/portfolio/positions"
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            return response.json()['data']['net']
            
        except Exception as e:
            logger.error(f"Position fetch failed: {e}")
            return []