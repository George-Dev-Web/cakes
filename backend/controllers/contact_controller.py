# backend/controllers/contact_controller.py
from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields

contact_bp = Blueprint('contact', __name__)

class ContactSchema(Schema):
    name = fields.Str(required=True)
    email = fields.Str(required=True)
    message = fields.Str(required=True)

contact_schema = ContactSchema()

@contact_bp.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    errors = contact_schema.validate(data)
    if errors:
        return jsonify({'message': 'Validation error', 'errors': errors}), 400
    
    # In Phase 3, this would send an email using SendGrid
    print(f"Contact form submission from {data['name']} ({data['email']}): {data['message']}")
    
    return jsonify({'message': 'Thank you for your message! We will get back to you soon.'}), 200