import { useEffect, useState } from "react";
import MapPage from "./MapPage";
import "../style/info.css";

export default function MapInfo() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setOpen(true);
    setTimeout(() => setVisible(true), 50);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => setOpen(false), 350);
  };

  return (
    <>
      <MapPage />

      {open && (
        <div className={`atlas-overlay ${visible ? "entered" : "entering"}`}>
          <div className="atlas-backdrop" onClick={close} aria-hidden="true" />

          <div className="atlas-modal" role="dialog" aria-modal="true">

            <div className="atlas-header">
              <div className="atlas-brand">
                
                <div>
                  <h2 className="atlas-title">Atlas.dev</h2>
                  <p className="atlas-subtitle">Une seule carte pour toutes les gouverner</p>
                </div>
              </div>
              <button className="atlas-close" onClick={close} aria-label="Fermer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="atlas-body">




              <p className="atlas-info">
                Bienvenue ! En <strong>10 secondes</strong>, tu maîtrises la navigation, le zoom et la création de spots. Voilà tout ce qu'il faut savoir :
              </p>

              <div className="atlas-grid">
                <div className="atlas-card">
                  <div className="atlas-card-emoji">🖱️</div>
                  <div>
                    <h3>Se déplacer</h3>
                    <p>Clic gauche + glisser pour naviguer sur la carte</p>
                  </div>
                </div>
                <div className="atlas-card">
                  <div className="atlas-card-emoji">🔎</div>
                  <div>
                    <h3>Zoom</h3>
                    <p>Molette souris ou trackpad pour zoomer / dézoomer</p>
                  </div>
                </div>
                <div className="atlas-card">
                  <div className="atlas-card-emoji">📍</div>
                  <div>
                    <h3>Créer un spot</h3>
                    <p>Clic droit pour poser un nouveau spot</p>
                  </div>
                </div>
                <div className="atlas-card">
                  <div className="atlas-card-emoji">🧾</div>
                  <div>
                    <h3>Voir un spot</h3>
                    <p>Clique sur un marker pour voir son emplacement</p>
                  </div>
                </div>
              </div>

              <div className="atlas-divider" />

              <div className="atlas-actions">
                <span className="atlas-hint">Prêt à explorer ?</span>
                <div className="atlas-btns">
                  <button className="btn-ghost">Connexion</button>
                  <button className="btn-outline">Inscription</button>
                  <button className="btn-primary" onClick={close}>
                    Commencer
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}