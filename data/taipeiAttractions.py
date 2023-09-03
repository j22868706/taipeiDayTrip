import json
import mysql.connector
import re

with open('taipei-attractions.json', 'r', encoding='utf-8') as file:
    attractions_data = json.load(file)
    attractionsDataResults = attractions_data["result"]["results"]


con = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root1234",
    database="taipeiDayTrip"
    )

cursor = con.cursor()
    
for attaractionDataresult in attractionsDataResults:
    rownumber = attaractionDataresult["RowNumber"]
    name = attaractionDataresult["name"]
    catagory = attaractionDataresult["CAT"]
    description = attaractionDataresult["description"]
    address = attaractionDataresult["address"]
    transport = attaractionDataresult["direction"]
    mrt = attaractionDataresult["MRT"]
    lat = attaractionDataresult["latitude"]
    lng = attaractionDataresult["longitude"]
    insertQuery = (
        "INSERT INTO attractions (rownumber, name, category, description, address, transport, mrt, latitude, longitude) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    )
    data = (rownumber, name, catagory, description, address, transport, mrt, lat, lng)
    
    cursor.execute(insertQuery, data)

for imgResult in attractionsDataResults:
    rowNumber = imgResult["RowNumber"]
    imageUrlsCombined = imgResult["file"]
    
    imageUrlsList = imageUrlsCombined.split("https://")
    for url in imageUrlsList[1:]:
        imageUrl = "https://" + url.strip()  
        if imageUrl.lower().endswith(('.jpg', '.png')):
            insertImgQuery = "INSERT INTO attractionImages (attractionRownumber, imageUrl) VALUES (%s, %s)"
            insertImgValues = (rowNumber, imageUrl)
            cursor.execute(insertImgQuery, insertImgValues)

con.commit()
cursor.close()
con.close()