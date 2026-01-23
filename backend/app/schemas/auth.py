from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    username: EmailStr
    password: str
    full_name: str

class Token(BaseModel):
    access_token: str
    token_type: str