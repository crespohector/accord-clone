from flask import Blueprint, jsonify, session, request
from flask_login import current_user
from app.models import db, User, Server, Category, Channel
from app.forms import ServerForm

server_routes = Blueprint("server", __name__)

@server_routes.route("/", methods=["GET"])
def getServers():
    '''
    get all servers
    '''
    servers = Server.query.all()
    return {"servers": [server.to_dict() for server in servers]}


@server_routes.route('/', methods=["POST"])
def post_server():
    '''
    CREATE a server
    '''
    form = ServerForm()
    user = User.query.get(current_user.id)

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        server = Server(
            server_name=form.data['server_name'],
            img_url=form.data['img_url'],
            owner_id=current_user.id
        )
        db.session.add(user)
        db.session.add(server)
        user.servers.append(server)
        db.session.commit()

        new_category = Category(title="General")
        db.session.add(new_category)
        db.session.commit()

        new_channel = Channel(title="room 1", category_id=new_category.id, server_id=server.id)
        db.session.add(new_channel)
        db.session.commit()

        return server.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@server_routes.route('/<id>', methods=["PUT"])
def update_server(id):
    '''
    UPDATE a server
    '''
    server = Server.query.get(id)
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():

        server["server_name"] = form.data['server_name']
        server["img_url"] = form.data['img_url']
        server["owner_id"] = current_user.id

        db.session.add(server)
        db.session.commit()

        return server.to_dict()

    # if validation fails
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@server_routes.route('/<id>', methods=["DELETE"])
def server(id):
    '''
    Delete a server
    '''
    server = Server.query.get(id)
    db.session.delete(server)
    db.session.commit()
    return server.to_dict()


@server_routes.route('/<id>', methods=["GET"])
def get_server(id):
    '''
    Getting current server
    '''

    server = Server.query.get(id)
    test = server.to_dict
    return {"server": server.to_dict()}
