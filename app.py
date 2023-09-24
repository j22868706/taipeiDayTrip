from flask import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

import mysql.connector
import json
from collections import OrderedDict
import jwt
import datetime
app.debug = True


@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


@app.route("/api/attractions")
def attractions():
    try:
        con = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root1234",
            database="taipeiDayTrip"
        )

        cursor = con.cursor()

        attraction_list = []
        keyword = request.args.get('keyword')
        page = int(request.args.get('page', 0))
        
        if keyword:
            query = "SELECT * FROM attractions WHERE (name LIKE %s ) OR (mrt = %s )"
            attraction_list.append('%' + keyword + '%')
            attraction_list.append(keyword)
        else:
            query = "SELECT * FROM attractions"

        query += " ORDER BY id LIMIT %s, 12"
        attraction_list.append(page * 12)

        cursor.execute(query, attraction_list)

        data = cursor.fetchall()

        next_page_query = "SELECT COUNT(*) FROM attractions LIMIT %s, 12"
        attraction_list = [page * 12] 
        cursor.execute(next_page_query, attraction_list)
        next_page_data = cursor.fetchall()

        if next_page_data:
            total_results = next_page_data[0][0]
        else: 
             total_results = 0  

        response_data = OrderedDict()
        response_data["nextPage"] = page + 1 if len(data) >= 12 else None  
        response_data["data"] = None if len(data) == 0 else []

        for row in data:
            attraction = OrderedDict()
            attraction["id"] = row[0]
            attraction["name"] = row[2]
            attraction["category"] = row[3]
            attraction["description"] = row[4]
            attraction["address"] = row[5]
            attraction["transport"] = row[6]
            attraction["mrt"] = row[7]
            attraction["lat"] = row[8]
            attraction["lng"] = row[9]
            attraction["images"] = []

            img_query = "SELECT imageUrl FROM attractionImages WHERE attractionRownumber = %s"
            cursor.execute(img_query, (row[1],))
            img_data = cursor.fetchall()

            attraction["images"] = [img[0] for img in img_data]

            response_data["data"].append(attraction)

        con.close()

        return json.dumps(response_data, ensure_ascii=False).encode('utf8')

    except Exception as e:
        error_response = {
            "error": True,
            "message": "請按照情境提供對應的錯誤訊息"
        }
        return json.dumps(error_response, ensure_ascii=False).encode('utf8'), 500 


@app.route("/api/attraction/<int:attractionId>")
def get_attraction(attractionId):
    print(attractionId)
    try:
        con = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root1234",
            database="taipeiDayTrip"
        )

        cursor = con.cursor()

        query = "SELECT * FROM attractions WHERE id = %s"
        cursor.execute(query, (attractionId,))
        data = cursor.fetchall()

        if len(data) == 0:
            error_response = {
                "error": True,
                "message": "請按照情境提供對應的錯誤訊息"
            }
            return json.dumps(error_response, ensure_ascii=False).encode('utf8'), 400  
        
        attraction_id_response = {"data": {}}

        attraction = {
            "id": data[0][0],
            "name": data[0][2],
            "category": data[0][3],
            "description": data[0][4],
            "address": data[0][5],
            "transport": data[0][6],
            "mrt": data[0][7],
            "lat": data[0][8],
            "lng": data[0][9],
            "images": []
        }

        img_query = "SELECT imageUrl FROM attractionImages WHERE attractionRownumber = %s"
        cursor.execute(img_query, (data[0][1],))
        img_data = cursor.fetchall()

        attraction["images"] = [img[0] for img in img_data]
        attraction_id_response["data"] = attraction

        con.close()

        return json.dumps(attraction_id_response, ensure_ascii=False).encode('utf8')

    except Exception as e:
        error_response = {
            "error": True,
            "message": "請按照情境提供對應的錯誤訊息"
        }
        return json.dumps(error_response, ensure_ascii=False).encode('utf8'), 500  

@app.route("/api/mrts")
def mrts():
    try:    
        con = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Montegomery@3303",
            database="taipeiDayTrip"
        )

        cursor = con.cursor()
        mrts_list = []
        mrts_response_data = {"data": mrts_list}

        query = "SELECT DISTINCT mrt FROM attractions ORDER BY (SELECT COUNT(*) FROM attractions AS a WHERE a.mrt = attractions.mrt) DESC"
        cursor.execute(query)
        mrt_results = cursor.fetchall()

        for mrt_result in mrt_results:
            mrts_list.append(mrt_result[0])

        cursor.close()
        con.close() 

        return json.dumps(mrts_response_data, ensure_ascii=False).encode('utf8')
    
    except Exception as e:
        mrt_error_response = {
            "error": True,
            "message": "請按照情境提供對應的錯誤訊息"
        }
        print("Error:", e)
        return json.dumps(mrt_error_response, ensure_ascii=False).encode('utf8'), 500 

@app.route('/api/user', methods=["POST"])
def signup():
    con = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Montegomery@3303",
        database="taipeiDayTrip"
    )
    signupName = request.form["signupName"]
    signupEmail = request.form["signupEmail"]
    signupPassword = request.form["signupPassword"]

    cursor = con.cursor()

    cursor.execute("SELECT * FROM membership WHERE email = %s", (signupEmail,))
    existing_user = cursor.fetchone()

    if existing_user:
        con.close()
        signup_error_response = {"error": True, "message": "這個電子郵箱已經被使用!"}
        return jsonify(signup_error_response), 400
    try:
        cursor.execute("INSERT INTO membership (name, email, password) VALUES (%s, %s, %s)",
                       (signupName, signupEmail, signupPassword))
        con.commit()
        con.close()
        signup_success_response = {"ok": True, "message": "註冊成功"}
        return jsonify(signup_success_response), 200
    except Exception as e:
        con.close()
        print("Error:", e)
        signup_error_response = {"error": True, "message": "註冊失敗"}
        return jsonify(signup_error_response), 500

@app.route('/api/user/auth', methods=["PUT"])
def signin():
    try:
        con = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Montegomery@3303",
            database="taipeiDayTrip"
        )
        signinEmail = request.form["signinEmail"]
        signinPassword = request.form["signinPassword"]
        cursor = con.cursor()

        cursor.execute("SELECT * FROM membership WHERE email = %s AND password =%s" , (signinEmail, signinPassword))
        signinMembership = cursor.fetchall()
        for signinRow in signinMembership:
            if signinRow[2] == signinEmail and signinRow[3] == signinPassword:
                user_info = {
                   "id": signinRow[0],
                   "name": signinRow[1],
                   "email": signinRow[2]
                }
                expiration_time = datetime.datetime.utcnow() + datetime.timedelta(days=7)
                secret_key = "My_secret_key"
                token = jwt.encode({"user": user_info, "exp": expiration_time}, secret_key, algorithm="HS256")
                return jsonify({"token": token})
        return jsonify({"error":True, "message":"電子郵件或密碼錯誤"}), 400 
    except Exception as e:
        signin_error_response = {
        "error": True,
        "message": "請按照情境提供對應的錯誤訊息"
        }
        return jsonify(signin_error_response), 500 

def authenticate_token(f):
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        secret_key = "My_secret_key"
        if token is None:
            return jsonify(data=None)
        
        token_parts = token.split()
        if len(token_parts) != 2 or token_parts[0].lower() != "bearer":
            return jsonify(data=None)
        
        jwt_token = token_parts[1]
        
        try:
            decode_token = jwt.decode(jwt_token, secret_key, algorithms=["HS256"])
            token_user_info = decode_token.get("user", None)
            if token_user_info is None:
                return jsonify(data=None)
            return jsonify(data=token_user_info)
        except jwt.ExpiredSignatureError:
            print("JWTToken過期")
            return jsonify(data=None), 400
        except jwt.InvalidTokenError as e:
            print("JWTToken無效:", str(e))
            return jsonify(data=None), 400
    return decorated


@app.route("/api/user/auth", methods=["GET"])
@authenticate_token
def user_auth(current_user):
    return jsonify(data=current_user)



app.run(host="0.0.0.0", port=3000)