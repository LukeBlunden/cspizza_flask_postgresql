# import requests
import os
from flask import Flask, render_template, request, redirect, session, url_for, flash
from flask_login import LoginManager, login_user,logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
import json

# Config stuff 
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///cspizza"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SECRET_KEY'] = 'XF!1E18U&Ci!eLr*zfB7s&1$ZKtv^9D'
# app.config['TEMPLATES_AUTO_RELOAD'] = True
# app.jinja_env.auto_reload = True

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

# Link model with app
from models import Pizza, Order, User

@login_manager.user_loader
def load_user(user_id):
  return User.query.get(int(user_id))

@app.route("/")
def index():
  return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
  if request.method == "POST":
    email = request.form.get("email")
    password = request.form.get("password")
    remember = True if request.form.get("remember") else False

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
      flash("Please check your login details and try again")
      return redirect(url_for("login")) # if user doesn't exist or password is wrong redirect to login
    # If the user passes the check redirect to orders/ profile  
    login_user(user, remember=remember)
    return redirect(url_for("order"))
  return render_template("login.html")

@app.route("/signup", methods=["GET", "POST"])
def signup():
  if request.method == "POST":
    email = request.form.get("email")
    name = request.form.get("name")
    password = request.form.get("password")

    user = User.query.filter_by(email=email).first() #If this returns a user than email address already exists
    if user:
      flash("Email address already exists")
      return redirect(url_for("signup"))

    if len(password) < 6:
      flash("Please use a longer password")
      return redirect(url_for("signup"))

    new_user = User(email=email, name=name, password=generate_password_hash(password, method="sha256"))
    db.session.add(new_user)
    db.session.commit()

    return redirect(url_for("login"))
  return render_template("signup.html")

@app.route("/logout")
@login_required
def logout():
  logout_user()
  return redirect(url_for("index"))

@app.route("/order", methods=["GET", "POST"])
@login_required
def order():
  errors = []
  if request.method == "POST":
    try:
      pizzaNames = request.form.getlist("itemName")
      pizzaQuantities = request.form.getlist("itemQuantity")
      pizzaPrices = request.form.getlist("itemPrice")
      totalPrice = request.form.getlist("totalPrice")
      orderData = {}
      for i, pizza in enumerate(pizzaNames):
        orderData[pizza] = {
          "quantity": pizzaQuantities[i],
          "price": pizzaPrices[i]
        }
      order = Order(
        user_id=current_user.id,
        orderData=json.dumps(orderData),
        total=float(totalPrice[0])
      )
      db.session.add(order)
      db.session.commit()
    except Exception as error:
      # errors.append(
      #   "Unable to add Order to database"
      # )
      # print(errors)
      db.session.flush()
      db.session.rollback()
      print(error) 
    return redirect("/order")
  else:
    return render_template("order.html")

@app.route("/profile", methods=["GET"])
@login_required
def profile():
  past_orders = Order.query.filter_by(user_id=current_user.id)
  for order in past_orders:
    order.orderData = json.loads(order.orderData)
  return render_template("profile.html", orders=past_orders)

if __name__ == "__main__":
  app.run(debug=True)