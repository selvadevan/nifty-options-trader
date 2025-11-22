from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv
import os

socketio = SocketIO(cors_allowed_origins="*")

def create_app():
    """Application factory pattern for Flask app"""
    load_dotenv()
    
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    
    # Enable CORS for API access
    CORS(app)
    
    # Initialize SocketIO for real-time updates
    socketio.init_app(app)
    
    # Register blueprints
    from app.routes.api import api_bp
    from app.routes.orders import orders_bp
    from app.routes.analytics import analytics_bp
    
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    
    return app