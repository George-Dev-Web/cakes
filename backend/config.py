# backend/config.py
import os
from datetime import timedelta


class Config:
    """Base configuration with secure defaults."""
    
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-change-in-production'
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://postgres:911Gt3RS@localhost/cake_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,  # Verify connections before using them
        'pool_recycle': 300,    # Recycle connections after 5 minutes
    }
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-change-in-production'
    JWT_TOKEN_LOCATION = ['cookies']  # Store JWT in HTTP-only cookies
    JWT_ACCESS_COOKIE_NAME = 'access_token_cookie'
    JWT_COOKIE_HTTPONLY = True  # Prevent JavaScript access (XSS protection)
    JWT_COOKIE_SECURE = os.environ.get('FLASK_ENV') == 'production'  # HTTPS only in production
    JWT_COOKIE_SAMESITE = 'Lax'  # CSRF protection
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # CORS Configuration
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # Application Settings
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    TESTING = False

class DevelopmentConfig(Config):
    """Development-specific configuration."""
    DEBUG = True
    JWT_COOKIE_SECURE = False  # Allow HTTP in development

class ProductionConfig(Config):
    """Production-specific configuration."""
    DEBUG = False
    JWT_COOKIE_SECURE = True  # Force HTTPS in production
    TESTING = False

class TestingConfig(Config):
    """Testing-specific configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_COOKIE_SECURE = False

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
