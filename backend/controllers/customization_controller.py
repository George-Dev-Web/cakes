from flask import Blueprint, request, jsonify
from extensions import db
from models.customization import CustomizationOption
from marshmallow import Schema, fields

customization_bp = Blueprint("customizations", __name__, url_prefix="/api")

class CustomizationOptionSchema(Schema):
    id = fields.Int(dump_only=True)
    category = fields.Str(required=True)
    name = fields.Str(required=True)
    price = fields.Float(required=True)
    active = fields.Bool()

customization_option_schema = CustomizationOptionSchema()
customization_options_schema = CustomizationOptionSchema(many=True)


# Get all active customizations
# @customization_bp.route("/customizations", methods=["GET"])
# def get_customizations():
#     customizations = CustomizationOption.query.filter_by(active=True).all()
#     grouped = {}
#     for c in customizations:
#         if c.category not in grouped:
#             grouped[c.category] = []
#         grouped[c.category].append(customization_option_schema.dump(c))
#     return jsonify(grouped), 200
@customization_bp.route("/customizations", methods=["GET"])
def get_customizations():
    customizations = CustomizationOption.query.filter_by(active=True).all()
    result = customization_options_schema.dump(customizations)  # flat array
    return jsonify(result), 200



# Admin: Add a new customization
@customization_bp.route("/admin/customizations", methods=["POST"])
def add_customization():
    data = request.get_json()
    new_item = CustomizationOption(
        name=data.get("name"),
        category=data.get("category"),
        price=data.get("price", 0.0)
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(customization_option_schema.dump(new_item)), 201


# Admin: Update customization
@customization_bp.route("/admin/customizations/<int:id>", methods=["PUT"])
def update_customization(id):
    data = request.get_json()
    customization = CustomizationOption.query.get_or_404(id)
    customization.name = data.get("name", customization.name)
    customization.category = data.get("category", customization.category)
    customization.price = data.get("price", customization.price)
    if 'active' in data:
        customization.active = data.get("active")
    db.session.commit()
    return jsonify(customization_option_schema.dump(customization)), 200


# Admin: Delete customization
@customization_bp.route("/admin/customizations/<int:id>", methods=["DELETE"])
def delete_customization(id):
    customization = CustomizationOption.query.get_or_404(id)
    db.session.delete(customization)
    db.session.commit()
    return "", 204
