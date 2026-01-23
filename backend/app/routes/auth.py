from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from schemas.auth import UserRegister, Token
from controllers.auth_controller import AuthController
from models.user import users_db

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    return AuthController.register_user(user)

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or not AuthController.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Connection refused.",
        )
    
    access_token = AuthController.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}