from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app.schemas.auth import UserRegister, Token
from app.database import users_collection 
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from typing import List

router = APIRouter()

# 1. Setup Security & Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "COSMIC_KEY"
ALGORITHM = "HS256"

# 2. HELPER: Verify Token (Must be defined BEFORE the routes that use it)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token"
            )
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Could not validate credentials"
        )

# 3. AUTH ENDPOINTS

@router.post("/register")
async def register(user: UserRegister):
    print(f"--- REGISTRATION ATTEMPT: {user.username} ---")
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Identity already initialized.")
    
    try:
        # Hash password with 72-char limit safety
        raw_password = str(user.password)[:72]
        hashed_password = pwd_context.hash(raw_password)
        
        new_user = {
            "username": user.username,
            "password": hashed_password,
            "full_name": user.full_name,
            "role": "user",
            "created_at": datetime.utcnow()
        }
        
        await users_collection.insert_one(new_user)
        return {"message": "Identity secured in MongoDB Cluster"}
        
    except ValueError as e:
        print(f"BCRYPT ERROR: {e}")
        raise HTTPException(status_code=500, detail="Security Cipher Error")

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"username": form_data.username})
    
    # Verify password (match the truncation logic)
    if not user or not pwd_context.verify(form_data.password[:72], user["password"]):
        raise HTTPException(status_code=401, detail="Invalid Security Cipher")
    
    access_token = jwt.encode(
        {"sub": user["username"], "exp": datetime.utcnow() + timedelta(hours=24)},
        SECRET_KEY, algorithm=ALGORITHM
    )
    return {"access_token": access_token, "token_type": "bearer"}

# 4. PROTECTED ENDPOINT: GET ALL USERS

@router.get("/users", response_model=List[dict])
async def get_all_users(current_user: str = Depends(get_current_user)):
    """
    Retrieves all users. Requires a valid Bearer Token.
    """
    users = []
    # Exclude passwords for security
    cursor = users_collection.find({}, {"password": 0})
    
    async for user in cursor:
        user["_id"] = str(user["_id"])
        users.append(user)
    
    return users