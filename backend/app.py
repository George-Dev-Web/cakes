from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, migrate, ma, jwt
import os

# Import all models so Flask-Migrate can detect them
from models.user import User
from models.cake import Cake
from models.order import Order
from models.customization import CustomizationOption
from models.order_customization import OrderCustomization

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    jwt.init_app(app)
    
    # Configure CORS based on environment
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    CORS(app, 
         resources={r"/api/*": {"origins": frontend_url}},
         supports_credentials=True
    )
    
    # Register blueprints
    from controllers.cake_controller import cake_bp
    from controllers.order_controller import order_bp
    from controllers.auth_controller import auth_bp
    from controllers.contact_controller import contact_bp
    from controllers.admin_controller import admin_bp
    from controllers.customization_controller import customization_bp
    
    app.register_blueprint(cake_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(order_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(contact_bp, url_prefix='/api')
    app.register_blueprint(customization_bp, url_prefix='/api')
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
