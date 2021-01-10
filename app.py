from flask import Flask, render_template, g, request, redirect, url_for, Response, abort, session, jsonify, make_response, send_file
from hamlish_jinja import HamlishExtension
from werkzeug.datastructures import ImmutableDict
import os
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin
from collections import defaultdict
from datetime import timedelta
import datetime
from flask_bootstrap import Bootstrap
from marshmallow_sqlalchemy import ModelSchema
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.lib.pagesizes import A4, portrait
from reportlab.platypus import Table, TableStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from api.database import db, ma
from models.item import Item, ItemSchema
from models.customer import Customer, CustomerSchema
from models.mstsetting import MstSetting, MstSettingSchema
from models.daicho import Daicho, DaichoSchema, VDaichoA, VDaichoASchema
from models.seikyu import Seikyu, SeikyuSchema, VSeikyuA, VSeikyuASchema
from print.seikyu import *

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

db.init_app(app)
ma.init_app(app)
        
@app.route("/favicon.ico")
def favicon():
    return app.send_static_file("favicon.ico")
    
@app.route('/getCustomer_Main/<group_kb>/<yuko_muko>')
def resJson_getCustomer_Main(group_kb, yuko_muko):
      if yuko_muko == "2":
        customers = Customer.query.filter(Customer.group_id==group_kb).all()
      elif yuko_muko == "1":
        customers = Customer.query.filter(Customer.group_id==group_kb, Customer.list!=None).all()
      else:
        customers = Customer.query.filter(Customer.group_id==group_kb, Customer.list==None).all()
        
      customers_schema = CustomerSchema(many=True)
      return jsonify({'data': customers_schema.dumps(customers, ensure_ascii=False)})

@app.route('/getItem_Daicho/')
def resJson_getItem_Daicho():
     items = Item.query.all()
     items_schema = ItemSchema(many=True)
     return jsonify({'data': items_schema.dumps(items, ensure_ascii=False)})

@app.route('/getVDaichoA_ByCusotmerId/<customerid>')
def resJson_getVDaichoA_ByCusotmerId(customerid):
      daicho = VDaichoA.query.filter(VDaichoA.customer_id==customerid).all()
      daicho_schema = VDaichoASchema(many=True)
      return jsonify({'data': daicho_schema.dumps(daicho, ensure_ascii=False)})

@app.route('/getVSeikyuA_ByCusotmerIdAndTuki/<customerid>/<nentuki>')
def resJson_getVSeikyuA_ByCusotmerId(customerid, nentuki):
      seikyu = VSeikyuA.query.filter(VSeikyuA.customer_id==customerid, VSeikyuA.nen==nentuki[0:4], VSeikyuA.tuki==nentuki[4:6]).all()
      seikyu_schema = VSeikyuASchema(many=True)
      return jsonify({'data': seikyu_schema.dumps(seikyu, ensure_ascii=False)})



@app.route('/printSeikyu/<customerid>/<nentuki>/<randnum>')
def resPdf_printSeikyu(customerid, nentuki, randnum):
    timestamp = datetime.datetime.now()
    timestampStr = timestamp.strftime('%Y%m%d%H%M%S%f')
    make("file" + timestampStr)
    response = make_response()
    response.data = open("output/" + "file" + timestampStr + ".pdf", "rb").read()
    response.headers['Content-Disposition'] = "attachment; filename=unicode.pdf"
    response.mimetype = 'application/pdf'
    # return response
    return send_file("output/" + "file" + timestampStr + ".pdf", as_attachment=True)




@app.route('/getMstSetting_Main')
def resJson_getMstSetting_Main():
  setting = MstSetting.query.filter(MstSetting.param_id=="GROUP_KB").all() #変更
  setting_schema = MstSettingSchema(many=True)
  return jsonify({'data': setting_schema.dumps(setting, ensure_ascii=False)})


@app.route('/updAddDaicho/<param>')
def dbUpdate_updAddDaicho(param):
  vals = param.split(",")
  print(vals)
  for youbi in range(2, 9):
    if vals[youbi].isdecimal():
      Daicho.query.filter(Daicho.customer_id==vals[0], Daicho.item_id==vals[1], Daicho.youbi==(youbi-1)).delete()
      
      daicho = Daicho()
      daicho.customer_id = vals[0]
      daicho.item_id = vals[1]
      daicho.youbi = (youbi-1)
      daicho.quantity = vals[youbi]
      db.session.add(daicho)
      db.session.commit()
  return param


        
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



#
#
#def make(filename="resume"): # ファイル名の設定
#    pdf_canvas = set_info(filename) # キャンバス名の設定
#    print_string(pdf_canvas)
#    pdf_canvas.save() # pdfを保存
#
#def set_info(filename):
#    pdf_canvas = canvas.Canvas("./{0}.pdf".format(filename)) # 保存先の設定
#    # ファイル情報の登録（任意）
#    pdf_canvas.setAuthor("") # 作者
#    pdf_canvas.setTitle("") # 表題
#    pdf_canvas.setSubject("") # 件名
#    return pdf_canvas
#
#def print_string(pdf_canvas):
#
#    # フォント登録
#    pdfmetrics.registerFont(UnicodeCIDFont('HeiseiKakuGo-W5'))
#
#    # 用紙サイズ定義（この場合はA4）
#    width, height = A4
#    #pagesize=landscape(A4)
#
#    # フォントサイズ定義（この場合は24）
#    font_size = 24
#
#    pdf_canvas.setFont('HeiseiKakuGo-W5', font_size)
#
#    # 書き出す(横位置, 縦位置, 文字)を指定
#    pdf_canvas.drawString(60, 770, '履  歴ba書') 
#    
#
## おまじない
if __name__ == "__main__":
    app.run(debug=True)
