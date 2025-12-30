# backend/app.py
# backend/app.py
from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, migrate, ma, jwt

# Import ALL models so Flask-Migrate can detect them
from models.cake import Cake
from models.order import Order
from models.User import User 
# ----------------------------------------------------------------

def create_app(config_class=Config):
    """Application factory pattern for creating Flask app instances."""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    jwt.init_app(app)
    CORS(app, 
         resources={r"/api/*": {"origins": "http://localhost:5173"}}, # Limit access to your frontend
         supports_credentials=True # CRITICAL: Allows the Access-Control-Allow-Credentials header to be true
    )
    
    # Register all blueprints
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

# --- FIX 2: Define 'app' globally for Flask CLI/Migrate ---
# Flask-Migrate needs the initialized app instance (with 'db' extension registered) 
# to be defined globally (outside of if __name__ == '__main__':) when the file is imported.
app = create_app()


if __name__ == '__main__':
    app.run(debug=True)
