from motor.motor_asyncio import AsyncIOMotorClient
import os

# Replace <db_password> and the cluster address with your MongoDB Atlas string
MONGODB_URL = "mongodb+srv://Mayank8159:Sharma2005@cluster0.example.mongodb.net/itfarm?retryWrites=True&w=majority"

client = AsyncIOMotorClient(MONGODB_URL)
database = client.it_farm_db  # This is your database name

# Collections (Tables)
users_collection = database.get_collection("users")