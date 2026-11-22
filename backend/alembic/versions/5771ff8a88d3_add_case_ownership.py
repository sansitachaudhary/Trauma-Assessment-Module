
"""add case ownership

Revision ID: 5771ff8a88d3
Revises: c9328280b99e
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "5771ff8a88d3"
down_revision: Union[str, Sequence[str], None] = "c9328280b99e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add created_by as nullable initially.
    op.add_column(
        "cases",
        sa.Column("created_by", sa.Integer(), nullable=True),
    )

    # 2. Create the foreign key with an explicit name.
    op.create_foreign_key(
        "fk_cases_created_by_users",
        "cases",
        "users",
        ["created_by"],
        ["id"],
        ondelete="RESTRICT",
    )

    # 3. Create an index.
    op.create_index(
        "ix_cases_created_by",
        "cases",
        ["created_by"],
        unique=False,
    )

    # 4. Confirm that administrator ID 1 exists.
    connection = op.get_bind()

    admin_exists = connection.execute(
        sa.text(
            "SELECT id FROM users WHERE id = 1 AND role = 'admin'"
        )
    ).first()

    if admin_exists is None:
        raise RuntimeError(
            "Administrator with ID 1 not found. "
            "Cannot assign ownership to existing cases."
        )

    # 5. Assign existing cases to administrator ID 1.
    connection.execute(
        sa.text(
            "UPDATE cases SET created_by = 1 WHERE created_by IS NULL"
        )
    )

    # 6. Make created_by mandatory.
    op.alter_column(
        "cases",
        "created_by",
        existing_type=sa.Integer(),
        nullable=False,
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_cases_created_by_users",
        "cases",
        type_="foreignkey",
    )

    op.drop_index(
        "ix_cases_created_by",
        table_name="cases",
    )

    op.drop_column("cases", "created_by")
