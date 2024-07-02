from .db import db, SCHEMA, environment, add_prefix_for_prod

class Channel(db.Model):
    __tablename__ = 'channels'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(15), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("categories.id")),nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("servers.id")), nullable=False)

    #references for data going in
    category = db.relationship("Category", back_populates="channels")
    server = db.relationship("Server", back_populates="channels")

    #references for data going out
    chats = db.relationship("Chat", cascade="all, delete", back_populates="channel")


    created_on = db.Column(db.DateTime, server_default=db.func.now())
    updated_on = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())


    def to_dict(self):
        return {
        "id": self.id,
        "title": self.title,
        "category_id": self.category_id,
        "server_id": self.server_id,
       }
