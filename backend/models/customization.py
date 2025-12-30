# backend/models/customization.py
from extensions import db


class CustomizationOption(db.Model):
    __tablename__ = 'customization_options'
    
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(80), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, default=0.0)
    active = db.Column(db.Boolean, default=True)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    
    def to_dict(self):
        """Convert customization option to dictionary."""
        return {
            'id': self.id,
            'category': self.category,
            'name': self.name,
            'price': self.price,
            'active': self.active,
            'description': self.description,
            'image_url': self.image_url
        }
    
    def __repr__(self):
        return f'<CustomizationOption {self.category}: {self.name}>'
