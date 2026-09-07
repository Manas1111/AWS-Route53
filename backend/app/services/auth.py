import secrets
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.session import SessionModel


class AuthService:
    DEMO_EMAIL = "demo@route53.local"
    DEMO_PASSWORD = "route53"
    SESSION_DURATION_HOURS = 24

    @classmethod
    def get_or_create_demo_user(cls, db: Session) -> User:
        user = db.query(User).filter(User.email == cls.DEMO_EMAIL).first()
        if not user:
            user = User(
                email=cls.DEMO_EMAIL,
                password=cls.DEMO_PASSWORD,
                created_at=datetime.utcnow(),
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

    @classmethod
    def authenticate_user(cls, db: Session, email: str, password: str) -> Optional[User]:
        clean_email = email.strip().lower()
        user = db.query(User).filter(User.email == clean_email).first()
        if not user or user.password != password:
            return None
        return user

    @classmethod
    def create_session(cls, db: Session, user_id: int) -> SessionModel:
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=cls.SESSION_DURATION_HOURS)
        session = SessionModel(
            user_id=user_id,
            token=token,
            created_at=datetime.utcnow(),
            expires_at=expires_at,
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @classmethod
    def invalidate_session(cls, db: Session, token: str) -> bool:
        session = db.query(SessionModel).filter(SessionModel.token == token).first()
        if not session:
            return False
        db.delete(session)
        db.commit()
        return True

    @classmethod
    def get_user_by_token(cls, db: Session, token: str) -> Optional[User]:
        session = (
            db.query(SessionModel)
            .filter(
                SessionModel.token == token,
                SessionModel.expires_at > datetime.utcnow(),
            )
            .first()
        )
        if not session:
            return None
        return session.user
