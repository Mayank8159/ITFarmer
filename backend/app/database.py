from motor.motor_asyncio import AsyncIOMotorClient

# Use the EXACT string you copied from Atlas
# Replace the 'abc12' below with YOUR specific code
MONGODB_URL = "mongodb+srv://mayankfhacker:Sharma2005@cluster0.wjr2epg.mongodb.net/?appName=Cluster0"

client = AsyncIOMotorClient(MONGODB_URL)

# This selects your database
database = client.itfarm 

# This selects your collection
users_collection = database.get_collection("users")