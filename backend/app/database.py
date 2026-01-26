from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URL = "mongodb+srv://mayankfhacker:Sharma2005@cluster0.wjr2epg.mongodb.net/?appName=Cluster0"

client = AsyncIOMotorClient(MONGODB_URL)

database = client.itfarm

# Collections
users_collection = database.get_collection("users")
inquiry_collection = database.get_collection("inquiries")
