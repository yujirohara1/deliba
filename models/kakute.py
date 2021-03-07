from api.database import db, ma

## 実テーブル
class Kakute(db.Model): 
    __tablename__ = "kakute" 
    nen = db.Column(db.Integer, primary_key=True) 
    tuki = db.Column(db.Integer, primary_key=True) 
    customer_id = db.Column(db.Integer, primary_key=True) 
    kakute_ymdt = db.Column(db.DATETIME, nullable=False,primary_key=False)
    nyukin_ymdt = db.Column(db.DATETIME, nullable=False,primary_key=False)
    tenant_id   = db.Column(db.String(), primary_key=True) 

class KakuteSchema(ma.SQLAlchemyAutoSchema):
      class Meta:
            model = Kakute
            load_instance = True
