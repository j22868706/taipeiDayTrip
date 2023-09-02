from flask import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

import mysql.connector
import json
from collections import OrderedDict
app.debug = True

# Pages
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
            password="Montegomery@3303",
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
            password="Montegomery@3303",
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

        con.close()

        return json.dumps(attraction, ensure_ascii=False).encode('utf8')

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
        return json.dumps(mrt_error_response, ensure_ascii=False).encode('utf8'), 500 


app.run(host="0.0.0.0", port=3000)