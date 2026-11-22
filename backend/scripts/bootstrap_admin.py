
import sys
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))
from sqlalchemy import select

from app.db.database import SessionLocal
from app.models.user import User


def bootstrap_admin():
    if len(sys.argv) != 2:
        print("Usage: python scripts/bootstrap_admin.py <user_email>")
        return

    email = sys.argv[1].strip().lower()

    confirmation = input(
        f"Promote {email} to administrator? Type YES to confirm: "
    )

    if confirmation != "YES":
        print("Operation cancelled.")
        return

    db = SessionLocal()

    try:
        user = db.scalar(
            select(User).where(User.email == email)
        )

        if user is None:
            print("User not found.")
            return

        if not user.is_active:
            print("Cannot promote an inactive account.")
            return

        user.role = "admin"
        db.commit()

        print(f"Success! {email} is now an administrator.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    bootstrap_admin()

