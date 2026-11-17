from sqlmodel import Session, select
from backend.database import SavedCompound, engine, create_db
from fastapi import FastAPI, HTTPException
import httpx
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
create_db()
@app.get("/")
def root():
    return {"message": "Chemistry Explorer backend is alive"}

@app.get("/compound/{name}")
def get_compound(name: str):
    url = (
        f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/"
        f"{name}/property/"
        f"MolecularFormula,MolecularWeight,IUPACName,"
        f"XLogP,HBondDonorCount,HBondAcceptorCount,"
        f"RotatableBondCount,TPSA,ConnectivitySMILES/JSON"
    )

    response = httpx.get(url)

    if response.status_code == 404:
        raise HTTPException(
            status_code=404,
            detail=f'No compound found for "{name}"'
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail="PubChem is currently unavailable"
        )

    data = response.json()
    compound = data["PropertyTable"]["Properties"][0]
    cid = compound["CID"]

    description_url = (
        f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/"
        f"{cid}/description/JSON"
    )
    description_response = httpx.get(description_url)
    if description_response.status_code == 200:
        description_data = description_response.json()

        descriptions = description_data["InformationList"]["Information"]
        description = "No description available."
        for item in descriptions:
            if "Description" in item:
                description = item["Description"]
                break

        compound["Description"] = description
    else:
        compound["Description"] = "No description available."
    return compound

@app.post("/saved")
def save_compound(compound: SavedCompound):
    with Session(engine) as session:
        existing = session.exec(
            select(SavedCompound).where(SavedCompound.cid == compound.cid)
        ).first()

        if existing:
            return {
                "status": "exists",
                "compound": existing
            }

        session.add(compound)
        session.commit()
        session.refresh(compound)

        return {
            "status": "saved",
            "compound": compound
        }

@app.get("/saved")
def get_saved_compounds():
    with Session(engine) as session:
        compounds = session.exec(select(SavedCompound)).all()
        return compounds