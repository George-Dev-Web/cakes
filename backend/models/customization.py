# from extensions import db

# class Customization(db.Model):
#     __tablename__ = 'customizations'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     category = db.Column(db.String(50), nullable=False)
#     price = db.Column(db.Numeric(10, 2), default=0)
#     description = db.Column(db.Text)
#     image_url = db.Column(db.String(255))
#     is_active = db.Column(db.Boolean, default=True)
#     created_at = db.Column(db.DateTime, server_default=db.func.now())

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "name": self.name,
#             "category": self.category,
#             "price": float(self.price),
#             "description": self.description,
#             "image_url": self.image_url,
#             "is_active": self.is_active
#         }

# backend/models/customization.py
from extensions import db

class CustomizationOption(db.Model):
    __tablename__ = "customization_option"

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)  # e.g. 'flavor', 'topping', 'design', 'art'
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False, default=0.0)
    active = db.Column(db.Boolean, default=True)

    # Relationship to order customizations
    order_customizations = db.relationship('OrderCustomization', back_populates='customization')

    def __repr__(self):
        return f"<CustomizationOption {self.category}: {self.name} ({self.price})>"


class OrderCustomization(db.Model):
    __tablename__ = "order_customization"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    customization_id = db.Column(db.Integer, db.ForeignKey('customization_option.id'), nullable=False)

    # Relationships
    order = db.relationship('Order', back_populates='customizations')
    customization = db.relationship('CustomizationOption', back_populates='order_customizations')

    def __repr__(self):
        return f"<OrderCustomization order={self.order_id} customization={self.customization_id}>"
