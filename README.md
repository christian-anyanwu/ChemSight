# ChemSight

**Explore molecules, compare chemical properties, and save compounds in one place.**

ChemSight is a full-stack chemistry explorer that brings data from [PubChem](https://pubchem.ncbi.nlm.nih.gov/) into a searchable interface. Look up a compound, inspect its 2D molecular structure and properties, compare it with another compound, and save compounds for later reference.

## Features

- **Compound search:** Look up a chemical compound and view its molecular formula, description (when available), and PubChem CID.
- **Molecular visualization:** Display a 2D structure image sourced from PubChem.
- **Property exploration:** Inspect molecular weight, XLogP, hydrogen-bond donor and acceptor counts, rotatable bonds, and topological polar surface area (TPSA).
- **Side-by-side comparison:** Compare the properties of two compounds.
- **Saved compounds:** Store and revisit compounds using a local SQLite database.
- **SMILES copying:** Copy a compound's connectivity SMILES notation.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vinext, Vite, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | SQLite |
| Chemical data | PubChem PUG REST API |
| Tooling | pnpm, uv |

## Getting Started

### Prerequisites

- **Node.js 22.13.0 or later** (as specified in `package.json`)
- [pnpm](https://pnpm.io/installation)
- **Python** (see `backend/pyproject.toml` for the required version)
- [uv](https://docs.astral.sh/uv/getting-started/installation/)

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_CLONED_REPOSITORY_FOLDER
```

Replace the placeholders above with your repository URL and the directory created by `git clone`.

### 2. Start the backend

In a terminal:

```bash
cd backend
uv sync
uv run python -m uvicorn backend.main:app --app-dir src --reload --port 8000
```

The API runs at **http://127.0.0.1:8000**.

### 3. Start the frontend

Open a **second terminal** in the repository root:

```bash
pnpm install
pnpm dev
```

Visit **http://localhost:3000** to use ChemSight.

> Keep both servers running during local development. The frontend requests compound and saved-item data from the FastAPI backend at `127.0.0.1:8000`.

## Project Structure

```text
ChemSight/
├── app/
│   ├── page.tsx             # Compound search, details, and comparison
│   ├── layout.tsx           # App layout and metadata
│   ├── globals.css          # Global styles
│   ├── CopyButton.tsx       # Copy SMILES
│   └── SaveButton.tsx       # Save compounds
├── backend/
│   ├── src/backend/
│   │   ├── main.py          # FastAPI routes and application
│   │   └── database.py      # SQLite database logic
│   ├── pyproject.toml
│   └── uv.lock
├── public/                  # Static assets
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
└── README.md
```

## How It Works

1. The frontend sends search and comparison requests to the local FastAPI server.
2. The backend retrieves compound information using PubChem data.
3. ChemSight displays structure images, chemical properties, and comparison results.
4. Saved compounds are managed through the backend and stored in SQLite.

## Development Notes

- **Frontend:** `pnpm dev` from the repository root.
- **Backend:** `uv run python -m uvicorn backend.main:app --app-dir src --reload --port 8000` from `backend/`.
- **Production build:** `pnpm build`.
- The frontend currently uses a local backend URL. Deploying the app publicly will require hosting the API and configuring its address for the deployed frontend.
- Local databases, virtual environments, dependencies, and generated build artifacts should stay out of Git through `.gitignore`.

## Data Source

Chemical information and 2D structure imagery are sourced from [PubChem](https://pubchem.ncbi.nlm.nih.gov/), a resource from the U.S. National Library of Medicine's National Center for Biotechnology Information (NCBI).
