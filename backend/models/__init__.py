# backend/models/__init__.py
"""Models package for the cake shop application."""

from models.user import User
from models.cake import Cake
from models.order import Order
from models.customization import CustomizationOption
from models.order_customization import OrderCustomization

__all__ = [
    'User',
    'Cake',
    'Order',
    'CustomizationOption',
    'OrderCustomization'
]
