# backend/models/order.py
from extensions import db

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Allow null for guest orders
    cake_id = db.Column(db.Integer, db.ForeignKey('cake.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    delivery_date = db.Column(db.Date, nullable=False)
    special_requests = db.Column(db.Text)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, completed, cancelled
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), 
                          onupdate=db.func.current_timestamp())
    
    # Relationship
    cake = db.relationship('Cake', backref=db.backref('orders', lazy=True))
    
    def __repr__(self):
        return f'<Order {self.id} - {self.customer_name}>'