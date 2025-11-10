# # backend/make_admin.py
# import sys
# import os

# sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# from app import create_app
# from extensions import db
# from models.User import User

# def make_user_admin(email):
#     app = create_app()
    
#     with app.app_context():
#         user = User.query.filter_by(email=email).first()
#         if user:
#             user.is_admin = True
#             db.session.commit()
#             print(f"User {email} is now an admin.")
#         else:
#             print(f"User with email {email} not found.")

# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         print("Usage: python make_admin.py <email>")
#         sys.exit(1)
    
#     email = sys.argv[1]
#     make_user_admin(email)

# backend/make_admin.py
import sys
import os

# This line helps Python find your application files
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import your Flask app and database components
from app import create_app
from extensions import db
from models.User import User

def make_user_admin(email):
    # Create your Flask application
    app = create_app()
    
    # Run this code within the application context (required for database operations)
    with app.app_context():
        # Find the user by email
        user = User.query.filter_by(email=email).first()
        if user:
            # Set the user as admin
            user.is_admin = True
            # Save the change to database
            db.session.commit()
            print(f"✅ User {email} is now an admin.")
            return True
        else:
            print(f"❌ User with email {email} not found.")
            return False

# This part runs when you execute the script directly
if __name__ == "__main__":
    # Check if an email was provided as argument
    if len(sys.argv) != 2:
        print("Usage: python make_admin.py <email>")
        sys.exit(1)
    
    # Get the email from command line argument
    email = sys.argv[1]
    # Call the function to make the user admin
    make_user_admin(email)