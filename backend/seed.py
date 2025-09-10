# backend/seed.py
import sys
import os
from datetime import datetime, timedelta
import random

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from extensions import db
from models.cake import Cake
from models.User import User
from models.order import Order

def create_sample_data():
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        db.session.query(Order).delete()
        db.session.query(Cake).delete()
        db.session.query(User).delete()
        db.session.commit()
        
        # Create sample cakes
        print("Creating sample cakes...")
        cakes = [
            Cake(
                name="Chocolate Dream",
                description="Rich chocolate cake with layers of chocolate mousse and ganache frosting. Topped with chocolate shavings and fresh berries.",
                price=45.00,
                image_url="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80"
            ),
            Cake(
                name="Vanilla Bliss",
                description="Classic vanilla sponge with creamy buttercream frosting and fresh seasonal berries. Light and fluffy with a delicate vanilla flavor.",
                price=40.00,
                image_url="https://images.unsplash.com/photo-1558301197-5eb5f2a06e6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
            ),
            Cake(
                name="Red Velvet Elegance",
                description="Traditional red velvet cake with cream cheese frosting. Moist layers with a hint of cocoa, finished with decorative elements.",
                price=50.00,
                image_url="https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
            ),
            Cake(
                name="Lemon Delight",
                description="Zesty lemon cake with lemon curd filling and meringue frosting. Refreshing and tangy with a sweet finish.",
                price=42.00,
                image_url="https://images.unsplash.com/photo-1558301185-0c2f2a7b4db8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"
            ),
            Cake(
                name="Carrot Wonder",
                description="Moist carrot cake with cream cheese frosting and walnut pieces. Spiced with cinnamon and nutmeg for a warm flavor.",
                price=48.00,
                image_url="https://images.unsplash.com/photo-1627873646-08a0bbd48d8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"
            ),
            Cake(
                name="Strawberry Shortcake",
                description="Light sponge cake layered with fresh strawberries and whipped cream. A classic summer favorite.",
                price=44.00,
                image_url="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
            ),
            Cake(
                name="Cookies & Cream",
                description="Chocolate cake with crushed cookie pieces and cookies & cream frosting. Topped with chocolate cookie crumbs.",
                price=52.00,
                image_url="https://images.unsplash.com/photo-1577471488278-16cafe3549da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"
            ),
            Cake(
                name="Tropical Paradise",
                description="Coconut cake with pineapple filling and coconut cream frosting. Topped with toasted coconut and edible flowers.",
                price=55.00,
                image_url="https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            )
        ]
        
        for cake in cakes:
            db.session.add(cake)
        
        db.session.commit()
        print(f"Created {len(cakes)} sample cakes")
        
        # Create sample users
        print("Creating sample users...")
        users = [
            User(
                name="Emma Johnson",
                email="emma@example.com"
            ),
            User(
                name="James Wilson",
                email="james@example.com"
            ),
            User(
                name="Sophia Martinez",
                email="sophia@example.com"
            ),
            User(
                name="Michael Brown",
                email="michael@example.com"
            ),
            User(
                name="Admin User",
                email="admin@velveltbloom.com"
            )
        ]
        
        # Set passwords for all users
        for user in users:
            user.set_password("password123")  # Simple password for testing
        
        for user in users:
            db.session.add(user)
        
        db.session.commit()
        print(f"Created {len(users)} sample users")
        
        # Create sample orders
        print("Creating sample orders...")
        statuses = ['pending', 'confirmed', 'completed', 'cancelled']
        special_requests = [
            "Please add 'Happy Birthday' message",
            "Need it by 2 PM",
            "Allergic to nuts, please ensure no cross-contamination",
            "Add extra frosting",
            "Please make it eggless",
            "Delivery instructions: Ring bell twice",
            "Need vegan options",
            "Please include candles",
            ""
        ]
        
        orders = []
        
        # Create orders for each user
        for user in users:
            for i in range(random.randint(2, 5)):  # 2-5 orders per user
                cake = random.choice(cakes)
                quantity = random.randint(1, 3)
                delivery_date = datetime.now().date() + timedelta(days=random.randint(1, 30))
                
                order = Order(
                    user_id=user.id,
                    cake_id=cake.id,
                    quantity=quantity,
                    customer_name=user.name,
                    customer_email=user.email,
                    customer_phone=f"555-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
                    delivery_date=delivery_date,
                    special_requests=random.choice(special_requests),
                    total_price=cake.price * quantity,
                    status=random.choice(statuses),
                    created_at=datetime.now() - timedelta(days=random.randint(1, 90))
                )
                orders.append(order)
        
        # Add some guest orders (without user_id)
        for i in range(10):
            cake = random.choice(cakes)
            quantity = random.randint(1, 2)
            delivery_date = datetime.now().date() + timedelta(days=random.randint(1, 30))
            
            customer_names = ["Olivia Davis", "William Taylor", "Ava Anderson", "Benjamin Thomas", "Mia Jackson"]
            
            order = Order(
                user_id=None,
                cake_id=cake.id,
                quantity=quantity,
                customer_name=random.choice(customer_names),
                customer_email=f"customer{random.randint(100, 999)}@example.com",
                customer_phone=f"555-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
                delivery_date=delivery_date,
                special_requests=random.choice(special_requests),
                total_price=cake.price * quantity,
                status=random.choice(statuses),
                created_at=datetime.now() - timedelta(days=random.randint(1, 90))
            )
            orders.append(order)
        
        for order in orders:
            db.session.add(order)
        
        db.session.commit()
        print(f"Created {len(orders)} sample orders")
        
        print("Seed data created successfully!")
        
        # Print login information for testing
        print("\n=== Test User Login Information ===")
        for user in users:
            print(f"Email: {user.email}, Password: password123")
        
        print("\nYou can now log in with any of these accounts to test the application.")

if __name__ == "__main__":
    create_sample_data()