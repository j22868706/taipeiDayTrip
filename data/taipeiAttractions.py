import json
import mysql.connector

with open('taipei-attractions.json', 'r', encoding='utf-8') as file:
    attractions_data = json.load(file)
    

results = attractions_data["result"]["results"]
for result in results:
    name = result["name"]
    print(name)