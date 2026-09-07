from pydantic import BaseModel
from app.schemas.user import UserResponse


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    token: str
    user: UserResponse


class LogoutResponse(BaseModel):
    message: str
