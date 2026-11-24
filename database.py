import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv("app.env")

client = MongoClient(os.getenv("MONGO_URI"))

db = client["todo_database"]
tasks_collection = db["tasks"]