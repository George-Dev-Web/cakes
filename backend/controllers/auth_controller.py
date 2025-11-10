# backend/controllers/auth_controller.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.User import User
from marshmallow import Schema, fields, validate, EXCLUDE
import json

auth_bp = Blueprint('auth', __name__)

# Marshmallow schemas
class UserSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    id = fields.Int(dump_only=True)
    name = fields.Str()
    email = fields.Str()
    phone = fields.Str()
    address = fields.Str()
    preferences = fields.Method("get_preferences_dict")
    is_admin = fields.Boolean()  # Add this line to include is_admin field
    created_at = fields.DateTime(dump_only=True)
    
    def get_preferences_dict(self, obj):
        if hasattr(obj, 'get_preferences'):
            return obj.get_preferences()
        return {}

user_schema = UserSchema()

class LoginSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    email = fields.Str(required=True)
    password = fields.Str(required=True)

login_schema = LoginSchema()

class RegisterSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    name = fields.Str(required=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    phone = fields.Str(allow_none=True)
    address = fields.Str(allow_none=True)
    preferences = fields.Dict(allow_none=True)

register_schema = RegisterSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        errors = register_schema.validate(data)
        if errors:
            return jsonify({'message': 'Validation error', 'errors': errors}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'User already exists'}), 409
        
        # Create new user
        new_user = User(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            address=data.get('address')
        )
        new_user.set_password(data['password'])
        
        # Set preferences if provided
        if 'preferences' in data:
            new_user.set_preferences(data['preferences'])
        
        db.session.add(new_user)
        db.session.commit()
        
        # Generate access token with string identity
        access_token = create_access_token(identity=str(new_user.id))
        
        return jsonify({
            'token': access_token,
            'user': user_schema.dump(new_user)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in register: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        errors = login_schema.validate(data)
        if errors:
            return jsonify({'message': 'Validation error', 'errors': errors}), 400
        
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        if not user or not user.check_password(data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Generate access token with string identity
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'token': access_token,
            'user': user_schema.dump(user)
        })
        
    except Exception as e:
        print(f"Error in login: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        # Convert back to integer for database query
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify(user_schema.dump(user))
        
    except Exception as e:
        print(f"Error in get_current_user: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        # Convert back to integer for database query
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            user.name = data['name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'address' in data:
            user.address = data['address']
        if 'preferences' in data:
            user.set_preferences(data['preferences'])
        
        db.session.commit()
        
        return jsonify(user_schema.dump(user))
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in update_profile: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500