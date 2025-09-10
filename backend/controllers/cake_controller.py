# backend/controllers/cake_controller.py
from flask import Blueprint, jsonify, request
from extensions import db
from models.cake import Cake
from marshmallow import Schema, fields

cake_bp = Blueprint('cakes', __name__)

# Marshmallow schema for serialization
class CakeSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    description = fields.Str()
    price = fields.Float()
    image_url = fields.Str()

cake_schema = CakeSchema()
cakes_schema = CakeSchema(many=True)

@cake_bp.route('/cakes', methods=['GET'])
def get_cakes():
    cakes = Cake.query.all()
    return jsonify(cakes_schema.dump(cakes))

@cake_bp.route('/cakes/<int:id>', methods=['GET'])
def get_cake(id):
    cake = Cake.query.get_or_404(id)
    return jsonify(cake_schema.dump(cake))

# Admin endpoints for managing cakes (to be protected with auth in Phase 3)
@cake_bp.route('/cakes', methods=['POST'])
def create_cake():
    data = request.get_json()
    new_cake = Cake(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        image_url=data.get('image_url')
    )
    db.session.add(new_cake)
    db.session.commit()
    return jsonify(cake_schema.dump(new_cake)), 201

@cake_bp.route('/cakes/<int:id>', methods=['PUT'])
def update_cake(id):
    cake = Cake.query.get_or_404(id)
    data = request.get_json()
    
    cake.name = data.get('name', cake.name)
    cake.description = data.get('description', cake.description)
    cake.price = data.get('price', cake.price)
    cake.image_url = data.get('image_url', cake.image_url)
    
    db.session.commit()
    return jsonify(cake_schema.dump(cake))

@cake_bp.route('/cakes/<int:id>', methods=['DELETE'])
def delete_cake(id):
    cake = Cake.query.get_or_404(id)
    db.session.delete(cake)
    db.session.commit()
    return '', 204