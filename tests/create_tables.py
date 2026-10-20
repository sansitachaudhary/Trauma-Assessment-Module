
from sqlalchemy import inspect

from app.db.database import Base, engine
from app.models import Case, Assessment


def create_tables():
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)
    tables = inspector.get_table_names()

    print("Database tables created successfully!")
    print("Tables found:", tables)


if __name__ == "__main__":
    create_tables()
