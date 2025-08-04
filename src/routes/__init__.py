from flask import Blueprint

api = Blueprint('api', __name__)

@api.route('/ping')
def ping():
    return {"msg": "pong"}
