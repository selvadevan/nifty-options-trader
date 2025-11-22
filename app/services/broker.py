import sys
import os
# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auto_login import auto_login, load_access_token
from kiteconnect import KiteConnect
import logging

logger = logging.getLogger(__name__)

class BrokerService:
    """Unified broker interface with auto-authentication"""

    def __init__(self, api_key: str = None, api_secret: str = None, broker: str = 'zerodha'):
        self.broker = broker
        self.api_key = api_key or os.getenv('API_KEY')
        self.api_secret = api_secret or os.getenv('API_SECRET')
        self.kite = None
        self.access_token = None
        self._authenticate()

    def _authenticate(self):
        """Authenticate using auto-login"""
        try:
            # Try to load today's saved token first
            self.access_token = load_access_token()

            # If no valid token, do auto-login
            if not self.access_token:
                logger.info("No valid token found, attempting auto-login...")
                self.access_token = auto_login()

            if self.access_token:
                # Create authenticated Kite instance
                self.kite = KiteConnect(api_key=self.api_key)
                self.kite.set_access_token(self.access_token)
                logger.info("✅ Kite authenticated successfully")
            else:
                logger.error("❌ Authentication failed")

        except Exception as e:
            logger.error(f"Authentication error: {e}")

    def get_quote(self, symbol: str, exchange: str = 'NFO'):
        """Get real-time quote"""
        try:
            if not self.kite:
                raise Exception("Not authenticated")

            instruments = self.kite.quote([f'{exchange}:{symbol}'])
            return instruments.get(f'{exchange}:{symbol}')

        except Exception as e:
            logger.error(f"Quote fetch failed: {e}")
            return None

    def place_order(self, symbol: str, transaction_type: str, quantity: int,
                   price: float = None, order_type: str = 'LIMIT', product: str = 'NRML'):
        """Place order"""
        try:
            if not self.kite:
                raise Exception("Not authenticated")

            order_id = self.kite.place_order(
                variety=self.kite.VARIETY_REGULAR,
                exchange=self.kite.EXCHANGE_NFO,
                tradingsymbol=symbol,
                transaction_type=transaction_type,
                quantity=quantity,
                product=product,
                order_type=order_type,
                price=price
            )
            return order_id

        except Exception as e:
            logger.error(f"Order placement failed: {e}")
            return None

    def get_positions(self):
        """Get current positions"""
        try:
            if not self.kite:
                raise Exception("Not authenticated")

            positions = self.kite.positions()
            return positions['net']

        except Exception as e:
            logger.error(f"Position fetch failed: {e}")
            return []
    def get_holdings(self) -> List[Dict]:
        """Get all holdings"""
        try:
            headers = {
                'Authorization': f'token {self.api_key}:{self.access_token}'
            }

            url = f"{self.base_url}/portfolio/holdings"
            response = requests.get(url, headers=headers)
            response.raise_for_status()

            return response.json()['data']

        except Exception as e:
            logger.error(f"Holdings fetch failed: {e}")
            return []
