# models/order_customization.py
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from extensions import Base

class OrderCustomization(Base):
    __tablename__ = "order_customization"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("order.id"), nullable=False)
    customization_option_id = Column(Integer, ForeignKey("customization_option.id"), nullable=False)

    # Relationships
    order = relationship("Order", back_populates="customizations")
    option = relationship("CustomizationOption")
