from .db import db, SCHEMA, environment
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .user_server import user_server

import base64

class User(db.Model, UserMixin):
  __tablename__ = 'users'

  if environment == "production":
        __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key = True)
  username = db.Column(db.String(40), nullable = False, unique = True)
  email = db.Column(db.String(255), nullable = False, unique = True)
  profile_picture = db.Column(db.LargeBinary, nullable=False)
  hashed_password = db.Column(db.String(255), nullable = False)

  servers = db.relationship(
        "Server",
        secondary=user_server,
        # primaryjoin=(user_server.c.user_id == id),
        back_populates="users"
  )

  user_chats = db.relationship("Chat", back_populates="user")

  @property
  def password(self):
    return self.hashed_password

  @password.setter
  def password(self, password):
    self.hashed_password = generate_password_hash(password)


  def check_password(self, password):
    return check_password_hash(self.password, password)


  def to_dict(self):
    return {
      "id": self.id,
      "username": self.username,
      "email": self.email,
      "profile_picture": base64.b64encode(self.profile_picture).decode('utf-8')
    }
