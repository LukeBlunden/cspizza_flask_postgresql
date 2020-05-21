from flask_login import UserMixin
from datetime import datetime, timezone
from app import db
from sqlalchemy.dialects.postgresql import JSON

class Pizza(db.Model):
  __tablename__ = "pizzas"

  # Will run the first time we create a new pizza
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String())
  toppings = db.Column(db.String())
  price = db.Column(db.Float)

  # Will represent the object when we query for it
  def __init__(self, name, toppings):
    self.name = name
    self.toppings = toppings
    self.price = price

  def __repr__(self):
    return f"<id={self.id},name={self.name},toppings={self.toppings}>"
  
class Order(db.Model):
  __tablename__ = "orders"

  id = db.Column(db.Integer, primary_key=True)  
  user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
  orderData = db.Column(JSON)
  total = db.Column(db.Float)
  datetime = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))

  def __init__(self, user_id, orderData, total):
    self.user_id = user_id
    self.orderData = orderData
    self.total = total

  def __repr__(self):
    return f"Order no: {self.id} - Total price: {self.total} - data: {self.orderData}"

class User(UserMixin, db.Model):
  __tablename__ = "users"

  id = db.Column(db.Integer, primary_key=True, nullable=False)
  email = db.Column(db.String(100), unique=True)
  password = db.Column(db.String(100))
  name = db.Column(db.String(1000))
  orders = db.relationship("Order", backref="users", lazy=True)

  def __init__(self, email, password, name):
    self.email = email
    self.password = password
    self.name = name
    # self.orders = orders

  def __repr__(self):
    return f"User email: {self.email}"