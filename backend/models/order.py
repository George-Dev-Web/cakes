# backend/models/order.py
from extensions import db


class Order(db.Model):
    __tablename__ = 'order'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    cake_id = db.Column(db.Integer, db.ForeignKey('cake.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    delivery_date = db.Column(db.Date, nullable=False)
    special_requests = db.Column(db.Text)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp()
    )
    
    # Relationships
    customizations = db.relationship(
        'OrderCustomization',
        back_populates='order',
        cascade='all, delete-orphan'
    )
    
    def to_dict(self, include_relations=False):
        """Convert order object to dictionary."""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'cake_id': self.cake_id,
            'quantity': self.quantity,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'delivery_date': self.delivery_date.isoformat() if self.delivery_date else None,
            'special_requests': self.special_requests,
            'total_price': self.total_price,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_relations:
            data['cake'] = self.cake.to_dict() if self.cake else None
            data['customizations'] = [
                {
                    'id': c.id,
                    'option': c.option.to_dict() if c.option else None
                }
                for c in self.customizations
            ]
        
        return data
    
    def __repr__(self):
        return f'<Order {self.id} - {self.customer_name}>'
