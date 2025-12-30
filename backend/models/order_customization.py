# backend/models/order_customization.py
from extensions import db


class OrderCustomization(db.Model):
    __tablename__ = 'order_customization'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    customization_option_id = db.Column(
        db.Integer,
        db.ForeignKey('customization_options.id'),
        nullable=False
    )
    
    # Relationships
    order = db.relationship('Order', back_populates='customizations')
    option = db.relationship('CustomizationOption')
    
    def __repr__(self):
        return f'<OrderCustomization order={self.order_id} option={self.customization_option_id}>'
