# backend/config.py
import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-for-cake-website'
    POSTGRES_URI = 'postgresql://postgres:911Gt3RS@localhost/cake_db'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or POSTGRES_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)