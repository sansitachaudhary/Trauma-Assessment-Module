"""add persistent case workflow fields

Revision ID: f21c67ad95a1
Revises: dc392dcb9892
Create Date: 2026-11-24

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f21c67ad95a1"
down_revision: Union[str, Sequence[str], None] = "dc392dcb9892"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    existing_tables = set(sa.inspect(bind).get_table_names())

    if "cases" not in existing_tables:
        op.create_table(
            "cases",
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("description", sa.Text(), nullable=False),
            sa.Column("language", sa.String(length=20), nullable=False),
            sa.Column("status", sa.String(length=30), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_cases_id", "cases", ["id"], unique=False)

    if "assessments" not in existing_tables:
        op.create_table(
            "assessments",
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("case_id", sa.Integer(), nullable=False),
            sa.Column("svi", sa.Integer(), nullable=False),
            sa.Column("indicators", sa.JSON(), nullable=False),
            sa.Column("safety_review_required", sa.Boolean(), nullable=False),
            sa.Column("review_status", sa.String(length=30), nullable=False),
            sa.Column("model_version", sa.String(length=50), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.ForeignKeyConstraint(
                ["case_id"],
                ["cases.id"],
                ondelete="CASCADE",
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(
            "ix_assessments_case_id",
            "assessments",
            ["case_id"],
            unique=False,
        )
        op.create_index(
            "ix_assessments_id",
            "assessments",
            ["id"],
            unique=False,
        )

    case_indexes = {
        index["name"] for index in sa.inspect(bind).get_indexes("cases")
    }
    if "ix_cases_id" not in case_indexes:
        op.create_index("ix_cases_id", "cases", ["id"], unique=False)

    assessment_indexes = {
        index["name"]
        for index in sa.inspect(bind).get_indexes("assessments")
    }
    if "ix_assessments_case_id" not in assessment_indexes:
        op.create_index(
            "ix_assessments_case_id",
            "assessments",
            ["case_id"],
            unique=False,
        )
    if "ix_assessments_id" not in assessment_indexes:
        op.create_index(
            "ix_assessments_id",
            "assessments",
            ["id"],
            unique=False,
        )

    op.add_column(
        "cases",
        sa.Column(
            "assigned",
            sa.String(length=255),
            server_default="Unassigned",
            nullable=False,
        ),
    )
    op.add_column(
        "cases",
        sa.Column(
            "notes",
            sa.Text(),
            server_default=sa.text("''"),
            nullable=False,
        ),
    )
    op.add_column(
        "cases",
        sa.Column(
            "rule_based_score",
            sa.Integer(),
            server_default="0",
            nullable=False,
        ),
    )
    op.add_column(
        "cases",
        sa.Column(
            "rule_based_priority",
            sa.String(length=30),
            server_default="Low",
            nullable=False,
        ),
    )
    op.add_column(
        "cases",
        sa.Column(
            "rule_based_indicators",
            sa.JSON(),
            server_default=sa.text("'[]'"),
            nullable=False,
        ),
    )
    op.add_column(
        "cases",
        sa.Column(
            "history",
            sa.JSON(),
            server_default=sa.text("'[]'"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column("cases", "history")
    op.drop_column("cases", "rule_based_indicators")
    op.drop_column("cases", "rule_based_priority")
    op.drop_column("cases", "rule_based_score")
    op.drop_column("cases", "notes")
    op.drop_column("cases", "assigned")
