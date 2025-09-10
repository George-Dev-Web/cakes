# backend/controllers/order_controller.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.order import Order
from models.cake import Cake
from models.User import User
from marshmallow import Schema, fields

order_bp = Blueprint('orders', __name__)

# Marshmallow schema for serialization
class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    cake_id = fields.Int(required=True)
    quantity = fields.Int(required=True)
    customer_name = fields.Str(required=True)
    customer_email = fields.Str(required=True)
    customer_phone = fields.Str(required=True)
    delivery_date = fields.Date(required=True)
    special_requests = fields.Str()
    total_price = fields.Float(dump_only=True)
    status = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    cake_name = fields.Str(dump_only=True, attribute="cake.name")

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

@order_bp.route('/orders', methods=['POST'])
@jwt_required(optional=True)  # Allow both authenticated and guest orders
def create_order():
    data = request.get_json()
    errors = order_schema.validate(data)
    if errors:
        return jsonify({'message': 'Validation error', 'errors': errors}), 400
    
    # Get cake and calculate total price
    cake = Cake.query.get_or_404(data['cake_id'])
    total_price = cake.price * data['quantity']
    
    # Get user ID if authenticated
    user_id = get_jwt_identity() if get_jwt_identity() else None
    
    # Create new order
    new_order = Order(
        user_id=user_id,
        cake_id=data['cake_id'],
        quantity=data['quantity'],
        customer_name=data['customer_name'],
        customer_email=data['customer_email'],
        customer_phone=data['customer_phone'],
        delivery_date=data['delivery_date'],
        special_requests=data.get('special_requests', ''),
        total_price=total_price
    )
    
    db.session.add(new_order)
    db.session.commit()
    
    return jsonify(order_schema.dump(new_order)), 201

@order_bp.route('/orders/my-orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify(orders_schema.dump(orders))

@order_bp.route('/orders/<int:id>', methods=['GET'])
@jwt_required()
def get_order(id):
    order = Order.query.get_or_404(id)
    user_id = get_jwt_identity()
    
    # Check if user owns this order or is admin
    if order.user_id != user_id:
        return jsonify({'message': 'Access denied'}), 403
    
    return jsonify(order_schema.dump(order))

@order_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_all_orders():
    # In a real application, you would check for admin role here
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify(orders_schema.dump(orders))