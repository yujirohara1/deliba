from api.database import db, ma

class Item(db.Model): 
    __tablename__ = "item" 
    id = db.Column(db.Integer, primary_key=True) 
    code = db.Column(db.String(), nullable=False) 
    name1 = db.Column(db.String(), nullable=False) 

class ItemSchema(ma.SQLAlchemyAutoSchema):
      class Meta:
            model = Item
            load_instance = True
