# backend/controllers/admin_controller.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.User import User
from models.order import Order
from models.cake import Cake
from marshmallow import Schema, fields, EXCLUDE
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__)

# Admin authorization check
def require_admin():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user or not user.is_admin:
        return False
    return True

# Schemas
class CakeSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str(required=True)
    price = fields.Float(required=True)
    image_url = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

cake_schema = CakeSchema()
cakes_schema = CakeSchema(many=True)

class OrderSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    id = fields.Int(dump_only=True)
    user_id = fields.Int()
    cake_id = fields.Int()
    quantity = fields.Int()
    customer_name = fields.Str()
    customer_email = fields.Str()
    customer_phone = fields.Str()
    delivery_date = fields.Date()
    special_requests = fields.Str()
    total_price = fields.Float()
    status = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    cake_name = fields.Str(attribute="cake.name")
    user_email = fields.Str(attribute="user.email")

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

# Admin Dashboard Statistics
@admin_bp.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    if not require_admin():
        return jsonify({'message': 'Admin access required'}), 403
    
    try:
        # Total users
        total_users = User.query.count()
        
        # Total orders
        total_orders = Order.query.count()
        
        # Orders by status
        orders_by_status = {
            'pending': Order.query.filter_by(status='pending').count(),
            'confirmed': Order.query.filter_by(status='confirmed').count(),
            'completed': Order.query.filter_by(status='completed').count(),
            'cancelled': Order.query.filter_by(status='cancelled').count()
        }
        
        # Recent orders (last 7 days)
        seven_days_ago = datetime.now() - timedelta(days=7)
        recent_orders = Order.query.filter(Order.created_at >= seven_days_ago).count()
        
        # Total revenue
        total_revenue = db.session.query(db.func.sum(Order.total_price)).filter(
            Order.status.in_(['completed', 'confirmed'])
        ).scalar() or 0
        
        return jsonify({
            'total_users': total_users,
            'total_orders': total_orders,
            'orders_by_status': orders_by_status,
            'recent_orders': recent_orders,
            'total_revenue': float(total_revenue)
        })
        
    except Exception as e:
        print(f"Error fetching admin stats: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

# Get all orders with pagination
@admin_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_all_orders_admin():
    if not require_admin():
        return jsonify({'message': 'Admin access required'}), 403
    
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status_filter = request.args.get('status', type=str)
        
        query = Order.query.order_by(Order.created_at.desc())
        
        if status_filter:
            query = query.filter_by(status=status_filter)
        
        paginated_orders = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        orders_data = []
        for order in paginated_orders.items:
            orders_data.append({
                'id': order.id,
                'user_id': order.user_id,
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
                'cake_name': order.cake.name if order.cake else 'Unknown Cake',
                'user_email': order.user.email if order.user else 'Guest'
            })
        
        return jsonify({
            'orders': orders_data,
            'total': paginated_orders.total,
            'pages': paginated_orders.pages,
            'current_page': page
        })
        
    except Exception as e:
        print(f"Error fetching orders: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

# Update order status
@admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    if not require_admin():
        return jsonify({'message': 'Admin access required'}), 403
    
    try:
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'message': 'Status is required'}), 400
        
        valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled']
        if new_status not in valid_statuses:
            return jsonify({'message': 'Invalid status'}), 400
        
        order = Order.query.get_or_404(order_id)
        order.status = new_status
        db.session.commit()
        
        return jsonify({
            'message': 'Order status updated successfully',
            'order': order_schema.dump(order)
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating order status: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

# Get all cakes
@admin_bp.route('/cakes', methods=['GET'])
@jwt_required()
def get_all_cakes_admin():
    if not require_admin():
        return jsonify({'message': 'Admin access required'}), 403
    
    try:
        cakes = Cake.query.order_by(Cake.name).all()
        return jsonify(cakes_schema.dump(cakes))
        
    except Exception as e:
        print(f"Error fetching cakes: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

# Create new cake
@admin_bp.route('/cakes', methods=['POST'])
@jwt_required()
def create_cake():
    if not require_admin():
        return jsonify({'message': 'Admin access required'}), 403
    
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'description', 'price', 'image_url']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'message': f'Missing required field: {field}'}), 400
        
        # Create new cake
        new_cake = Cake(
            name=data['name'],
            description=data['description'],
            price=float(data['price']),
            image_url=data['image_url']
        )
        
        db.session.add(new_cake)
        db.session.commit()
        
        return jsonify({
            'message': 'Cake created successfully',
            'cake': cake_schema.dump(new_cake)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating cake: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

# Update cake
@admin_bp.route('/cakes/<int:cake_id>', methods=['PUT'])
@jwt_required()
def update_cake(cake_id):
    if not require_admin():
        return jsonify({'message': 'Admin access required'}), 403
    
    try:
        cake = Cake.query.get_or_404(cake_id)
        data = request.get_json()
        
        if 'name' in data:
            cake.name = data['name']
        if 'description' in data:
            cake.description = data['description']
        if 'price' in data:
            cake.price = float(data['price'])
        if 'image_url' in data:
            cake.image_url = data['image_url']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Cake updated successfully',
            'cake': cake_schema.dump(cake)
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating cake: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

# Delete cake
@admin_bp.route('/cakes/<int:cake_id>', methods=['DELETE'])
@jwt_required()
def delete_cake(cake_id):
    if not require_admin():
        return jsonify({'message': 'Admin access required'}), 403
    
    try:
        cake = Cake.query.get_or_404(cake_id)
        
        # Check if cake has orders
        if cake.orders:
            return jsonify({'message': 'Cannot delete cake with existing orders'}), 400
        
        db.session.delete(cake)
        db.session.commit()
        
        return jsonify({'message': 'Cake deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting cake: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

# Get all users
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    if not require_admin():
        return jsonify({'message': 'Admin access required'}), 403
    
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        users = User.query.order_by(User.created_at.desc()).paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        users_data = []
        for user in users.items:
            users_data.append({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'is_admin': user.is_admin,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'order_count': len(user.orders)
            })
        
        return jsonify({
            'users': users_data,
            'total': users.total,
            'pages': users.pages,
            'current_page': page
        })
        
    except Exception as e:
        print(f"Error fetching users: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500