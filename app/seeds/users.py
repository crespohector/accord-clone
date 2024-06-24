from werkzeug.security import generate_password_hash
from app.models import db, User
from faker import Faker

faker = Faker()
# Adds a demo user, you can add other users here if you want
def seed_users():

    demo = User(username='Demo', email='demo@aa.io', password='password')
    db.session.add(demo)

    for i in range(0, 15):
        another = User(username=faker.name(), email = faker.email(), password='password')
        db.session.add(another)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
