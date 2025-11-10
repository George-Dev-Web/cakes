# # backend/models/user.py
# from extensions import db
# from werkzeug.security import generate_password_hash, check_password_hash
# import json

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     email = db.Column(db.String(100), unique=True, nullable=False)
#     password_hash = db.Column(db.String(128), nullable=False)
#     phone = db.Column(db.String(20))
#     address = db.Column(db.Text)
#     preferences = db.Column(db.Text)  # JSON string for storing user preferences
#     created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
#     updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), 
#                           onupdate=db.func.current_timestamp())
    
#     # Relationship with orders
#     orders = db.relationship('Order', backref='user', lazy=True)
    
#     def set_password(self, password):
#         self.password_hash = generate_password_hash(password)
    
#     def check_password(self, password):
#         return check_password_hash(self.password_hash, password)
    
#     def set_preferences(self, preferences_dict):
#         if preferences_dict:
#             self.preferences = json.dumps(preferences_dict)
#         else:
#             self.preferences = None
    
#     def get_preferences(self):
#         if self.preferences:
#             try:
#                 return json.loads(self.preferences)
#             except json.JSONDecodeError:
#                 return {}
#         return {}
    
#     def __repr__(self):
#         return f'<User {self.email}>'

# backend/models/user.py
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
import json

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    preferences = db.Column(db.Text)  # JSON string for storing user preferences
    is_admin = db.Column(db.Boolean, default=False)  # Add admin flag without changing existing logic
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), 
                          onupdate=db.func.current_timestamp())
    
    # Relationship with orders
    orders = db.relationship('Order', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def set_preferences(self, preferences_dict):
        if preferences_dict:
            self.preferences = json.dumps(preferences_dict)
        else:
            self.preferences = None
    
    def get_preferences(self):
        if self.preferences:
            try:
                return json.loads(self.preferences)
            except json.JSONDecodeError:
                return {}
        return {}
    
    def __repr__(self):
        return f'<User {self.email}>'