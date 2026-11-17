import CopyButton from "./CopyButton";
import SaveButton from "./SaveButton";

type Compound = {
  CID: number;
  MolecularFormula: string;
  MolecularWeight: string;
  IUPACName: string;
  XLogP?: number;
  HBondDonorCount?: number;
  HBondAcceptorCount?: number;
  RotatableBondCount?: number;
  TPSA?: number;
  ConnectivitySMILES?: string;
  Description?: string;
};
type SavedCompound = {
  id: number;
  cid: number;
  name: string;
  formula: string;
  smiles: string | null;
};
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    compare?: string;
  }>;
}) {
  const params = await searchParams;

  const query = params.q || "caffeine";
  const compareQuery = params.compare || "";

  const response = await fetch(
    `http://127.0.0.1:8000/compound/${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );

  let compareCompound: Compound | null = null;

  if (compareQuery) {
    const compareResponse = await fetch(
      `http://127.0.0.1:8000/compound/${encodeURIComponent(compareQuery)}`,
      { cache: "no-store" }
    );

    if (compareResponse.ok) {
      compareCompound = await compareResponse.json();
    }
  }

  const compound: Compound | null = response.ok
  ? await response.json()
  : null;
  const savedResponse = await fetch(
  "http://127.0.0.1:8000/saved",
  { cache: "no-store" }
  );

  const savedCompounds: SavedCompound[] = savedResponse.ok
    ? await savedResponse.json()
    : [];
  const properties = [
    {
      label: "Molecular weight",
      value: compound?.MolecularWeight ?? "N/A",
      unit: "g/mol",
    },
    {
      label: "XLogP",
      value: compound?.XLogP ?? "N/A",
      unit: "",
    },
    {
      label: "H-bond donors",
      value: compound?.HBondDonorCount ?? "N/A",
      unit: "",
    },
    {
      label: "H-bond acceptors",
      value: compound?.HBondAcceptorCount ?? "N/A",
      unit: "",
    },
    {
      label: "Rotatable bonds",
      value: compound?.RotatableBondCount ?? "N/A",
      unit: "",
    },
    {
      label: "Polar surface area",
      value: compound?.TPSA ?? "N/A",
      unit: "Å²",
    },
  ];

  return (
    <main>
      <nav className="site-nav">
        <a className="brand" href="#" aria-label="ChemSight home">
          <span className="brand-mark">O</span>
          <span>ChemSight</span>
        </a>
        <div className="nav-links" aria-label="Main navigation">
          <a className="active" href="#explore">Explore</a>
          <a href="#compare">Compare</a>
          <a href="#collections">Collections</a>
        </div>
        <button className="lab-button" type="button">Open lab</button>
      </nav>

      <section className="hero" id="explore">
        <div className="hero-copy">
          <p className="eyebrow">PUBCHEM · COMPOUND EXPLORER</p>
          <h1>Look closer at<br /><em>any molecule.</em></h1>
          <p className="hero-subtitle">
            Search trusted chemical data, inspect molecular properties, and build a
            clearer picture of the compounds around us.
          </p>
        </div>

        <form className="search-shell" action="/" method="get">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            aria-label="Search compounds"
            defaultValue={query}
            name="q"
            placeholder="Search by name, formula, CID, or SMILES"
          />
          <button type="submit">Search compound <span aria-hidden="true">→</span></button>
        </form>

        <div className="example-row">
          <span>TRY</span>
          <a href="/?q=aspirin">Aspirin</a>
          <a href="/?q=acetaminophen">Acetaminophen</a>
          <a href="/?q=theobromine">Theobromine</a>
        </div>
      </section>

      {!compound ? (
        <section className="compound-section">
          <div className="result-label">
            <span>01</span> SEARCH RESULT
          </div>

          <article className="compound-card">
            <div className="compound-details">
              <h2>No compound found</h2>
              <p>
                We couldn't find a compound matching "{query}".
                Check the spelling and try again.
              </p>
            </div>
          </article>
        </section>
      ) : (
        <section
          className="compound-section"
          aria-labelledby="compound-title"
        >
          <div className="result-label">
            <span>01</span> SEARCH RESULT
          </div>

          <article className="compound-card">
            <div className="structure-panel">
              <div className="panel-meta">
                <span>2D STRUCTURE</span>
                <span>CID {compound.CID}</span>
              </div>

              <div className="molecule-frame">
                <img
                  src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${compound.CID}/PNG?image_size=large`}
                  alt={`Two-dimensional molecular structure of ${query}`}
                />
              </div>

              <p className="source-note">
                Structure supplied by PubChem PUG REST
              </p>
            </div>

            <div className="compound-details">
              <div className="compound-heading">
                <div>
                  <p className="formula">{compound.MolecularFormula}</p>
                  <h2 id="compound-title">{query}</h2>
                </div>

                <SaveButton
                  cid={compound.CID}
                  name={query}
                  formula={compound.MolecularFormula}
                  smiles={compound.ConnectivitySMILES}
                />
              </div>

              <p className="description">
              {compound.Description ?? "No description available."}
            </p>

              <div className="property-grid">
                {properties.map((property) => (
                  <div className="property" key={property.label}>
                    <span>{property.label}</span>
                    <strong>
                      {property.value} <small>{property.unit}</small>
                    </strong>
                  </div>
                ))}
              </div>

              <div className="smiles-row">
                <div>
                  <span>CONNECTIVITY SMILES</span>
                  <code>{compound.ConnectivitySMILES ?? "Not available"}</code>
                </div>

                <CopyButton text={compound.ConnectivitySMILES ?? ""} />
              </div>
            </div>
          </article>
        </section>
            )}
            <section className="compound-section" id="compare">
              <div className="result-label">
                <span>02</span> COMPARE
              </div>

              <form className="search-shell compare-shell" action="/#compare" method="get">
              <input type="hidden" name="q" value={query} />

              <span className="search-icon" aria-hidden="true">⌕</span>

              <input
                aria-label="Compare with another compound"
                name="compare"
                defaultValue={compareQuery}
                placeholder="Compare with another compound"
              />

              <button type="submit">
                Compare <span aria-hidden="true">→</span>
              </button>
            </form>

              {compareQuery && !compareCompound ? (
                  <article className="compound-card">
                    <div className="compound-details">
                      <h2>No comparison compound found</h2>
                      <p>
                        We couldn't find a compound matching "{compareQuery}".
                      </p>
                    </div>
                  </article>
                ) : compareCompound && compound ? (
                  <div className="compare-grid">
                    <div className="compare-heading">
                      <span>PROPERTY</span>
                      <strong>{query}</strong>
                      <strong>{compareQuery}</strong>
                    </div>

                    <div className="compare-row">
                      <span>Formula</span>
                      <strong>{compound.MolecularFormula}</strong>
                      <strong>{compareCompound.MolecularFormula}</strong>
                    </div>

                    <div className="compare-row">
                      <span>Molecular weight</span>
                      <strong>{compound.MolecularWeight} g/mol</strong>
                      <strong>{compareCompound.MolecularWeight} g/mol</strong>
                    </div>

                    <div className="compare-row">
                      <span>XLogP</span>
                      <strong>{compound.XLogP ?? "N/A"}</strong>
                      <strong>{compareCompound.XLogP ?? "N/A"}</strong>
                    </div>

                    <div className="compare-row">
                      <span>H-bond donors</span>
                      <strong>{compound.HBondDonorCount ?? "N/A"}</strong>
                      <strong>{compareCompound.HBondDonorCount ?? "N/A"}</strong>
                    </div>

                    <div className="compare-row">
                      <span>H-bond acceptors</span>
                      <strong>{compound.HBondAcceptorCount ?? "N/A"}</strong>
                      <strong>{compareCompound.HBondAcceptorCount ?? "N/A"}</strong>
                    </div>

                    <div className="compare-row">
                      <span>Rotatable bonds</span>
                      <strong>{compound.RotatableBondCount ?? "N/A"}</strong>
                      <strong>{compareCompound.RotatableBondCount ?? "N/A"}</strong>
                    </div>

                    <div className="compare-row">
                      <span>Polar surface area</span>
                      <strong>{compound.TPSA ?? "N/A"} Å²</strong>
                      <strong>{compareCompound.TPSA ?? "N/A"} Å²</strong>
                    </div>
                  </div>
                ) : null}
          </section>

      <section className="compound-section" id="collections">
        <div className="result-label">
          <span>03</span> COLLECTIONS
        </div>

        <div className="property-grid">
          {savedCompounds.map((saved) => (
            <a
              className="property"
              key={saved.id}
              href={`/?q=${encodeURIComponent(saved.name)}`}
            >
              <span>{saved.formula}</span>
              <strong>{saved.name}</strong>
              <small>CID {saved.cid}</small>
            </a>
          ))}
        </div>
      </section>

      <footer>
        <span>ChemSight / SCIENTIFIC SOFTWARE</span>
        <span>Data sourced from PubChem</span>
      </footer>
    </main>
  );
}
