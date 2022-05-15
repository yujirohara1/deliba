from api.database import db, ma

class OrderItem(db.Model): 
    __tablename__ = "order_item" 
    id = db.Column(db.Integer, primary_key=True) 
    order_ymd = db.Column(db.Date, nullable=False) 
    hope_ymd = db.Column(db.Date, nullable=False) 
    item_id = db.Column(db.Integer, primary_key=False) 
    item_code = db.Column(db.String(), nullable=False) 
    item_name1 = db.Column(db.String(), nullable=False) 
    item_siire = db.Column(db.Integer, nullable=False) 
    quantity = db.Column(db.Integer, nullable=False) 
    send_stamp = db.Column(db.DATETIME, nullable=False,primary_key=False)
    receive_stamp = db.Column(db.DATETIME, nullable=False,primary_key=False)
    tenant_id   = db.Column(db.String(), primary_key=True) 

class OrderItemSchema(ma.SQLAlchemyAutoSchema):
      class Meta:
            model = OrderItem
            load_instance = True

#       列       |           タイプ            | 照合順序 | Null 値を許容 |               デフォルト
# ---------------+-----------------------------+----------+---------------+----------------------------------------
#  id            | integer                     |          | not null      | nextval('order_item_id_seq'::regclass)
#  order_ymd     | date                        |          | not null      |
#  hope_ymd      | date                        |          | not null      |
#  item_id       | integer                     |          | not null      |
#  item_code     | character varying(20)       |          | not null      |
#  item_name1    | character varying(80)       |          | not null      |
#  item_siire    | integer                     |          | not null      |
#  quantity      | integer                     |          | not null      |
#  send_stamp    | timestamp without time zone |          | not null      |
#  receive_stamp | timestamp without time zone |          | not null      |
#  tenant_id     | character varying(80)       |          | not null      |
# インデックス:
#     "order_item_pkey" PRIMARY KEY, btree (id, item_id, tenant_id)


class VOrderItem(db.Model): 
    __tablename__ = "v_order_item" 
    id = db.Column(db.Integer, primary_key=True) 
    code = db.Column(db.String(), primary_key=False) 
    name1 = db.Column(db.String(), primary_key=False) 
    tanka = db.Column(db.Float, primary_key=False) 
    tenant_id   = db.Column(db.String(), primary_key=True) 

class VOrderItemSchema(ma.SQLAlchemyAutoSchema):
      class Meta:
            model = VOrderItem
            load_instance = True


class VOrderedGroup(db.Model): 
    __tablename__ = "v_ordered_group" 
    send_stamp = db.Column(db.DATETIME, nullable=False,primary_key=True)
    tenant_id   = db.Column(db.String(), primary_key=True) 
    min_id = db.Column(db.Integer, primary_key=False) 
    max_id = db.Column(db.Integer, primary_key=False) 
    order_ymd = db.Column(db.Date, nullable=False) 
    hope_ymd = db.Column(db.Date, nullable=False) 
    kensu = db.Column(db.Integer, primary_key=True) 
    total = db.Column(db.Integer, primary_key=True) 
    receive_stamp = db.Column(db.DATETIME, nullable=False,primary_key=False)
    biko   = db.Column(db.String(), primary_key=True) 
    
class VOrderedGroupSchema(ma.SQLAlchemyAutoSchema):
      class Meta:
            model = VOrderedGroup
            load_instance = True
