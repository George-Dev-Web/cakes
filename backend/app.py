# backend/app.py
from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, migrate, ma

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    CORS(app)
    
    # Register blueprints
    from controllers.cake_controller import cake_bp
    from controllers.order_controller import order_bp
    
    app.register_blueprint(cake_bp, url_prefix='/api')
    app.register_blueprint(order_bp, url_prefix='/api')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)