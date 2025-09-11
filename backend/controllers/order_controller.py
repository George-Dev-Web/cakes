# backend/controllers/order_controller.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.order import Order
from models.cake import Cake
from marshmallow import Schema, fields, validate, EXCLUDE
from datetime import datetime

order_bp = Blueprint('orders', __name__)

# Marshmallow schema for serialization
class OrderSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    id = fields.Int(dump_only=True)
    cake_id = fields.Int(required=True)
    quantity = fields.Int(required=True, validate=validate.Range(min=1))
    customer_name = fields.Str(required=True)
    customer_email = fields.Str(required=True, validate=validate.Email())
    customer_phone = fields.Str(required=True)
    delivery_date = fields.Date(required=True)
    special_requests = fields.Str(allow_none=True)
    total_price = fields.Float(dump_only=True)
    status = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    cake_name = fields.Str(dump_only=True, attribute="cake.name")

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

@order_bp.route('/orders', methods=['POST'])
@jwt_required(optional=True)
def create_order():
    try:
        data = request.get_json()
        
        # Get user ID if authenticated (convert from string to int)
        user_id = None
        try:
            current_identity = get_jwt_identity()
            if current_identity:
                user_id = int(current_identity)
        except (ValueError, TypeError):
            user_id = None
        
        # Validate required fields
        required_fields = ['cake_id', 'quantity', 'customer_name', 'customer_email', 
                          'customer_phone', 'delivery_date']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'message': f'Missing required field: {field}'}), 422
        
        # Parse delivery date
        try:
            delivery_date = datetime.strptime(data['delivery_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 422
        
        # Check if delivery date is in the future
        if delivery_date <= datetime.now().date():
            return jsonify({'message': 'Delivery date must be in the future'}), 422
        
        # Get cake and calculate total price
        cake = Cake.query.get(data['cake_id'])
        if not cake:
            return jsonify({'message': 'Cake not found'}), 404
        
        total_price = cake.price * data['quantity']
        
        # Create new order
        new_order = Order(
            user_id=user_id,
            cake_id=data['cake_id'],
            quantity=data['quantity'],
            customer_name=data['customer_name'],
            customer_email=data['customer_email'],
            customer_phone=data['customer_phone'],
            delivery_date=delivery_date,
            special_requests=data.get('special_requests', ''),
            total_price=total_price
        )
        
        db.session.add(new_order)
        db.session.commit()
        
        # Return the created order with cake name
        order_data = {
            'id': new_order.id,
            'cake_id': new_order.cake_id,
            'quantity': new_order.quantity,
            'customer_name': new_order.customer_name,
            'customer_email': new_order.customer_email,
            'customer_phone': new_order.customer_phone,
            'delivery_date': new_order.delivery_date.isoformat(),
            'special_requests': new_order.special_requests,
            'total_price': new_order.total_price,
            'status': new_order.status,
            'created_at': new_order.created_at.isoformat() if new_order.created_at else None,
            'cake_name': cake.name
        }
        
        return jsonify(order_data), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating order: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@order_bp.route('/orders/my-orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    try:
        user_id = get_jwt_identity()
        # Convert string identity back to integer
        user_id_int = int(user_id)
        
        orders = Order.query.filter_by(user_id=user_id_int).order_by(Order.created_at.desc()).all()
        
        # Manually serialize the orders to avoid schema issues
        orders_data = []
        for order in orders:
            orders_data.append({
                'id': order.id,
                'cake_id': order.cake_id,
                'quantity': order.quantity,
                'customer_name': order.customer_name,
                'customer_email': order.customer_email,
                'customer_phone': order.customer_phone,
                'delivery_date': order.delivery_date.isoformat() if order.delivery_date else None,
                'special_requests': order.special_requests,
                'total_price': order.total_price,
                'status': order.status,
                'created_at': order.created_at.isoformat() if order.created_at else None,
                'cake_name': order.cake.name if order.cake else 'Unknown Cake'
            })
        
        return jsonify(orders_data)
        
    except ValueError:
        return jsonify({'message': 'Invalid user identity'}), 422
    except Exception as e:
        print(f"Error fetching user orders: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@order_bp.route('/orders/<int:id>', methods=['GET'])
@jwt_required()
def get_order(id):
    try:
        order = Order.query.get_or_404(id)
        user_id = get_jwt_identity()
        
        # Check if user owns this order
        if order.user_id != int(user_id):
            return jsonify({'message': 'Access denied'}), 403
        
        # Manually serialize the order
        order_data = {
            'id': order.id,
            'cake_id': order.cake_id,
            'quantity': order.quantity,
            'customer_name': order.customer_name,
            'customer_email': order.customer_email,
            'customer_phone': order.customer_phone,
            'delivery_date': order.delivery_date.isoformat() if order.delivery_date else None,
            'special_requests': order.special_requests,
            'total_price': order.total_price,
            'status': order.status,
            'created_at': order.created_at.isoformat() if order.created_at else None,
            'cake_name': order.cake.name if order.cake else 'Unknown Cake'
        }
        
        return jsonify(order_data)
        
    except Exception as e:
        print(f"Error fetching order: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500