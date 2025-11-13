# # backend/models/customization.py
# from extensions import db

# class CustomizationOption(db.Model):
#     __tablename__ = "customization_option"

#     id = db.Column(db.Integer, primary_key=True)
#     category = db.Column(db.String(50), nullable=False)  # e.g. 'flavor', 'topping', 'design', 'art'
#     name = db.Column(db.String(100), nullable=False)
#     price = db.Column(db.Float, nullable=False, default=0.0)
#     active = db.Column(db.Boolean, default=True)

#     # Relationship to order customizations
#     order_customizations = db.relationship('OrderCustomization', back_populates='customization')

#     def __repr__(self):
#         return f"<CustomizationOption {self.category}: {self.name} ({self.price})>"


# class OrderCustomization(db.Model):
#     __tablename__ = "order_customization"

#     id = db.Column(db.Integer, primary_key=True)
#     order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
#     customization_id = db.Column(db.Integer, db.ForeignKey('customization_option.id'), nullable=False)

#     # Relationships
#     order = db.relationship('Order', back_populates='customizations')
#     customization = db.relationship('CustomizationOption', back_populates='order_customizations')

#     def __repr__(self):
#         return f"<OrderCustomization order={self.order_id} customization={self.customization_id}>"

from extensions import db

class CustomizationOption(db.Model):
    __tablename__ = 'customization_options'

    id = db.Column(db.Integer, primary_key=True)
    
    # Core Customization Fields
    category = db.Column(db.String(80), nullable=False) # e.g., Design, Flavor, Topping, Art
    name = db.Column(db.String(120), nullable=False)   # e.g., Round, Chocolate, Sprinkles, Text Inscription
    price = db.Column(db.Float, default=0.0)
    active = db.Column(db.Boolean, default=True)

    # Optional Fields for richer customization options
    description = db.Column(db.Text, nullable=True) # Detailed notes for complex options
    image_url = db.Column(db.String(255), nullable=True) # URL for visual display

    def __repr__(self):
        return f"<CustomizationOption {self.category}: {self.name}>"

# NOTE: You will need to run a database migration tool (like Flask-Migrate)
# or manually re-create your database tables for these changes to take effect.