from werkzeug.security import generate_password_hash
from app.models import db, User, SCHEMA, environment
from faker import Faker
import os

faker = Faker()
# Adds a demo user, you can add other users here if you want
def seed_users():
    # get file path to the assets profile folder
    assets_profile_dir = os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "assets-profile-images"
        )
    profile_images = os.listdir(assets_profile_dir)

    file_path_to_image_0 = os.path.join(assets_profile_dir, profile_images[0])
    file_path_to_image_3 = os.path.join(assets_profile_dir, profile_images[3])

    with open(file_path_to_image_0, 'rb') as file:
        img_data = file.read()
        demo = User(username='Demo', email='demo@aa.io', profile_picture=img_data, password='password')
        db.session.add(demo)

    with open(file_path_to_image_3, 'rb') as file:
        img_data = file.read()
        demo2 = User(username='Jane Ford', email='jane@yahoo.com', profile_picture=img_data, password='password')
        db.session.add(demo2)

    for image in profile_images:
        file_path_to_image = os.path.join(assets_profile_dir, image)
        with open(file_path_to_image, "rb") as file:
            img_data = file.read()
            another = User(username=faker.name(), email = faker.email(), profile_picture=img_data, password='password')
            db.session.add(another)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_users():

    if environment == "production":
         db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute('TRUNCATE table users RESTART IDENTITY CASCADE;')

    db.session.commit()
