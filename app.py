from flask import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
import mysql.connector
import json
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

    con = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root1234",
        database="taipeiDayTrip"
    )

    cursor = con.cursor()
    
    params = []
    keyword = request.args.get('keyword')
    page = int(request.args.get('page', 0))

  
    if keyword:
        query += " WHERE name LIKE %s OR mrt = %s"
        params.append('%' + keyword + '%')
        params.append(keyword)

    query += " LIMIT %s, 12"
    params.append(page * 12)

    cursor.execute(query, params)

    data = cursor.fetchall()

    con.close()

    response_data = {
        "nextPage": page + 1,
        "data": []
    }

    for row in data:
        attraction = {
            "id": row[0],
            "name": row[2],
            "category": row[3],
            "description": row[4],
            "address": row[5],
            "transport": row[6],
            "mrt": row[7],
            "lat": row[8],
            "lng": row[9],
        }
        response_data["data"].append(attraction)
	
    return json.dumps(response_data, ensure_ascii=False).encode('utf8')


app.run(host="0.0.0.0", port=3000)