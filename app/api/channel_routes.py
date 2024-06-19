from flask import Blueprint, session, request
from app.forms import ChannelForm
from app.models import Channel, db

channel_routes = Blueprint('channels', __name__)

@channel_routes.route('/')
def channels():
    '''
    GET all channels
    '''
    channels = Channel.query.all()
    return {"channels": [channel.to_dict() for channel in channels]}


@channel_routes.route('/server/<id>')
def channels_serverId(id):
    '''
    GET all channels based on server id
    '''
    channels = Channel.query.filter(Channel.server_id == id).all()
    return {"channels": [channel.to_dict() for channel in channels]}


@channel_routes.route('/category/<id>')
def channels_categoryId(id):
    '''
    GET all channels based on category id
    '''
    channels = Channel.query.filter(Channel.category_id == id).all()
    return {"channels": [channel.to_dict() for channel in channels]}


@channel_routes.route('/', methods=["POST"])
def post_channel():
    '''
    CREATE a channel
    '''
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    title = form.data['title']

    if form.validate_on_submit():

        if "#" not in title:
            title  = "#" + title

        channel = Channel(
            title=title,
            category_id=1,
            server_id=form.data['server_id']
        )
        db.session.add(channel)
        db.session.commit()
        return channel.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@channel_routes.route('/<id>', methods=["DELETE"])
def delete_channel(id):
    '''
    DELETE a channel
    '''
    channel = Channel.query.get(id)
    db.session.delete(channel)
    db.session.commit()
    return channel.to_dict()


@channel_routes.route('/<id>', methods=["PUT"])
def edit_channel(id):
    '''
    EDIT a channel
    '''
    form = ChannelForm()
    title = form.data['title']
    channel = Channel.query.get(id)
    if "#" not in title:
        title = "#" + title
    channel.title = title
    db.session.commit()
    return channel.to_dict()
