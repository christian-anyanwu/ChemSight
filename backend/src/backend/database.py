from sqlmodel import SQLModel, Field, create_engine


class SavedCompound(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    cid: int
    name: str
    formula: str
    smiles: str | None = None


engine = create_engine("sqlite:///chemistry.db")


def create_db():
    SQLModel.metadata.create_all(engine)