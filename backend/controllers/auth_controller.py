# backend/controllers/auth_controller.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.User import User
from marshmallow import Schema, fields

auth_bp = Blueprint('auth', __name__)

# Marshmallow schemas
class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()
    email = fields.Str()
    created_at = fields.DateTime(dump_only=True)

user_schema = UserSchema()

class LoginSchema(Schema):
    email = fields.Str(required=True)
    password = fields.Str(required=True)

login_schema = LoginSchema()

class RegisterSchema(Schema):
    name = fields.Str(required=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True)

register_schema = RegisterSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
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
        email=data['email']
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    # Generate access token
    access_token = create_access_token(identity=new_user.id)
    
    return jsonify({
        'token': access_token,
        'user': user_schema.dump(new_user)
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    errors = login_schema.validate(data)
    if errors:
        return jsonify({'message': 'Validation error', 'errors': errors}), 400
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Generate access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'token': access_token,
        'user': user_schema.dump(user)
    })

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user_schema.dump(user))