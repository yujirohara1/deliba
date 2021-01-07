from flask import Flask, render_template, g, request, redirect, url_for, Response, abort, session, jsonify 
from hamlish_jinja import HamlishExtension
from werkzeug.datastructures import ImmutableDict
import os
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin
from collections import defaultdict
from datetime import timedelta
from flask_bootstrap import Bootstrap
from marshmallow_sqlalchemy import ModelSchema
from api.database import db, ma
from models.item import Item, ItemSchema

class FlaskWithHamlish(Flask):
    jinja_options = ImmutableDict(
        extensions=[HamlishExtension]
    )
app = FlaskWithHamlish(__name__)
bootstrap = Bootstrap(app)


login_manager = LoginManager()
login_manager.init_app(app)
app.config['SECRET_KEY'] = "secret"

class User(UserMixin):
    def __init__(self, id, name, password):
        self.id = id
        self.name = name
        self.password = password

# ログイン用ユーザー作成
users = {
    1: User(1, "yujiro", "yjrhr1102"),
    2: User(2, "seiya", "seiya7293")
}

# ユーザーチェックに使用する辞書作成
nested_dict = lambda: defaultdict(nested_dict)
user_check = nested_dict()
for i in users.values():
    user_check[i.name]["password"] = i.password
    user_check[i.name]["id"] = i.id

@login_manager.user_loader
def load_user(user_id):
    return users.get(int(user_id))

# db_uri = "postgresql://postgres:yjrhr1102@localhost:5432/deliba_db" #"sqlite:///" + os.path.join(app.root_path, 'milk.db') 
db_uri = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app) 
# ma = Marshmallow(app)

db.init_app(app)
ma.init_app(app)
        
@app.route("/favicon.ico")
def favicon():
    return app.send_static_file("favicon.ico")
    
#@app.route('/')
#@login_required
#def hello_world():
#    entries = Item.query.all() #変更
#    # return render_template('login.haml', entries=entries)
#    return render_template('index.haml', entries=entries)

@app.route('/json')
def show_entries_json():
        # entries = Item.query.order_by(Item.id.desc()).all()
        entries = Item.query.all() #変更
        entries_schema = ItemSchema(many=True)
        return render_template('json.haml', entries=entries_schema.dumps(entries, ensure_ascii=False))
        # return jsonify({'entries': entries_schema.dumps(entries, ensure_ascii=False)})
        
@app.route('/api')
def show_json_api():
        # entries = Item.query.order_by(Item.id.desc()).all()
        entries = Item.query.all() #変更
        entries_schema = ItemSchema(many=True)
        # return render_template('json.haml', entries=entries_schema.dumps(entries, ensure_ascii=False))
        return jsonify({'data': entries_schema.dumps(entries, ensure_ascii=False)})
        
        
# @app.route('/post', methods=['POST'])
# def add_entry():
#     entry = Item()
#     entry.code = request.form['code']
#     entry.name1 = request.form['name1']
#     db.session.add(entry)
#     db.session.commit()
#     return redirect(url_for('hello_world'))

# ログインしないと表示されないパス
@app.route('/protected/')
@login_required
def protected():
    return Response('''
    protected<br />
    <a href="/logout/">logout</a>
    ''')

# ログインパス
@app.route('/', methods=["GET", "POST"])
def login():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=1)
    if(request.method == "POST"):
        # ユーザーチェック
        if(request.form["username"] in user_check and request.form["password"] == user_check[request.form["username"]]["password"]):
            # ユーザーが存在した場合はログイン
            login_user(users.get(user_check[request.form["username"]]["id"]))
            entries = Item.query.all() #変更
            return render_template('index.haml', entries=entries)
        else:
            return abort(401)
    else:
        return render_template("login.haml")

# ログアウトパス
@app.route('/logout/')
@login_required
def logout():
    logout_user()
    return Response('''
    logout success!<br />
    <a href="/login/">login</a>
    ''')

## おまじない
if __name__ == "__main__":
    app.run(debug=True)
