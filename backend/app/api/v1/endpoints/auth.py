from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, get_token_from_headers
from app.models.user import User
from app.schemas.auth import LoginRequest, AuthResponse, LogoutResponse
from app.schemas.user import UserResponse
from app.services.auth import AuthService

router = APIRouter()


@router.post("/login", response_model=AuthResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
) -> AuthResponse:
    user = AuthService.authenticate_user(
        db=db,
        email=login_data.email,
        password=login_data.password,
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    session = AuthService.create_session(db=db, user_id=user.id)
    return AuthResponse(
        token=session.token,
        user=UserResponse.model_validate(user),
    )


@router.post("/logout", response_model=LogoutResponse)
def logout(
    token: Optional[str] = Depends(get_token_from_headers),
    db: Session = Depends(get_db),
) -> LogoutResponse:
    if token:
        AuthService.invalidate_session(db=db, token=token)
    return LogoutResponse(message="Successfully logged out")


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    return UserResponse.model_validate(current_user)
