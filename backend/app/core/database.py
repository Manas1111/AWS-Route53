from pathlib import Path
from typing import Generator
from sqlalchemy import create_engine, event
from sqlalchemy.engine.url import make_url
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings


def _ensure_sqlite_parent_dir(database_url: str) -> None:
    if database_url.startswith("sqlite"):
        try:
            url = make_url(database_url)
            if url.database and url.database != ":memory:":
                parent = Path(url.database).parent
                if str(parent) not in ("", "."):
                    parent.mkdir(parents=True, exist_ok=True)
        except OSError:
            pass


_ensure_sqlite_parent_dir(settings.DATABASE_URL)

connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
)


@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if settings.DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    _ensure_sqlite_parent_dir(settings.DATABASE_URL)
    import app.models  # noqa: F401
    Base.metadata.create_all(bind=engine)

    from app.services.auth import AuthService
    db = SessionLocal()
    try:
        AuthService.get_or_create_demo_user(db)
    finally:
        db.close()
