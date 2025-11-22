import os

class Config:
    """Application configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Broker configuration
    BROKER_API_KEY = os.getenv('BROKER_API_KEY')
    BROKER_API_SECRET = os.getenv('BROKER_API_SECRET')
    BROKER_NAME = os.getenv('BROKER_NAME', 'zerodha')
    
    # Trading parameters for options selling
    MAX_POSITIONS = int(os.getenv('MAX_POSITIONS', 5))
    DEFAULT_LOT_SIZE = int(os.getenv('DEFAULT_LOT_SIZE', 50))
    RISK_PER_TRADE = float(os.getenv('RISK_PER_TRADE', 2.0))
    
    # NIFTY specific settings
    NIFTY_LOT_SIZE = 50
    EXPIRY_DAYS_MIN = 30  # Minimum days to expiry
    EXPIRY_DAYS_MAX = 45  # Maximum days to expiry
    
    # Risk management
    MAX_LOSS_PER_POSITION = 10000  # Rs
    STOP_LOSS_PERCENT = 30  # % of premium received