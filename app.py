from flask import Flask, render_template, g, request, redirect, url_for # 変更
from hamlish_jinja import HamlishExtension
# from werkzeug import ImmutableDict
from werkzeug.datastructures import ImmutableDict
import os
from flask_sqlalchemy import SQLAlchemy # 変更

class FlaskWithHamlish(Flask):
    jinja_options = ImmutableDict(
        extensions=[HamlishExtension]
    )
app = FlaskWithHamlish(__name__)

# app = Flask(__name__)

# db_uri = "postgresql://postgres:yjrhr1102@localhost:5432/deliba_db" #"sqlite:///" + os.path.join(app.root_path, 'milk.db') # 追加
db_uri = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri # 追加
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app) # 追加

class Item(db.Model): # 追加
    __tablename__ = "item" # 追加
    id = db.Column(db.Integer, primary_key=True) # 追加
    code = db.Column(db.String(), nullable=False) # 追加
    name1 = db.Column(db.String(), nullable=False) # 追加

@app.route('/')
def hello_world():
    entries = Item.query.all() #変更
    return render_template('index.haml', entries=entries)

@app.route('/post', methods=['POST'])
def add_entry():
    entry = Item()
    entry.code = request.form['code']
    entry.name1 = request.form['name1']
    db.session.add(entry)
    db.session.commit()
    return redirect(url_for('hello_world'))


## おまじない
if __name__ == "__main__":
    app.run(debug=True)
