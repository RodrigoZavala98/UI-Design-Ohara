import { useState } from "react";
import type { ReadingEntry } from "../data";
import { C } from "../theme";

type Props = {
  pages: number;
  currentPage: number;
  read: boolean;
  log: ReadingEntry[];
  onProgress: (toPage: number) => void;
  onToggleRead: () => void;
  onDeleteEntry: (id: string) => void;
};

/* dd – mm – yyyy, como en el diseño */
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d} – ${m} – ${y}`;
}

export default function BookTracking({
  pages, currentPage, read, log, onProgress, onToggleRead, onDeleteEntry,
}: Props) {
  const [updating, setUpdating] = useState(false);
  const [pageDraft, setPageDraft] = useState(String(currentPage));

  const percent = pages > 0 ? Math.round((currentPage / pages) * 100) : 0;
  const stars = read ? 1 : 0;

  const openUpdater = () => {
    setPageDraft(String(currentPage));
    setUpdating(true);
  };

  const commit = () => {
    const to = parseInt(pageDraft, 10);
    if (Number.isNaN(to)) return;
    onProgress(Math.max(0, Math.min(pages, to)));
    setUpdating(false);
  };

  return (
    <div className="p-5 animate-fade-in">

      {/* ── Avance — 30 % ESTRUCTURA con acento en la barra ── */}
      <div className="rounded-3xl p-5 mb-3" style={{ background: C.s }}>
        <div className="flex items-baseline justify-between">
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 700, color: C.ink, lineHeight: 1 }}>
            {percent}%
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", color: C.inkMid }}>
            Página {currentPage} de {pages}
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="w-full rounded-full overflow-hidden mt-3"
          style={{ height: "7px", background: `${C.sDark}` }}>
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              background: C.a,
              borderRadius: "99px",
              transition: "width 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>

        {updating ? (
          <div className="mt-4 animate-scale-in">
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: C.inkMid, marginBottom: "6px" }}>
              ¿En qué página vas?
            </p>
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={pageDraft}
                onChange={(e) => setPageDraft(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && commit()}
                inputMode="numeric"
                className="w-20 px-3 py-2.5 rounded-xl outline-none text-center"
                style={{
                  background: C.dSoft, color: C.ink,
                  fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 600,
                }}
              />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMid }}>
                / {pages}
              </span>
              <button
                onClick={commit}
                className="flex-1 py-2.5 rounded-xl font-semibold active:scale-95 transition-all"
                style={{ background: C.a, color: "white", fontFamily: "var(--font-sans)", fontSize: "13px" }}
              >
                Guardar
              </button>
              <button
                onClick={() => setUpdating(false)}
                className="px-3.5 py-2.5 rounded-xl font-medium active:scale-95 transition-all"
                style={{ background: C.dSoft, color: C.inkMid, fontFamily: "var(--font-sans)", fontSize: "13px" }}
              >
                Cancelar
              </button>
            </div>

            {/* Saltos rápidos desde la página actual */}
            <div className="flex gap-2 mt-2.5">
              {[10, 25, 50].map((step) => (
                <button
                  key={step}
                  onClick={() => setPageDraft(String(Math.min(pages, currentPage + step)))}
                  className="px-3 py-1.5 rounded-full active:scale-95 transition-all"
                  style={{
                    background: C.dSoft, color: C.a,
                    fontFamily: "var(--font-sans)", fontSize: "11.5px", fontWeight: 600,
                  }}
                >
                  +{step}
                </button>
              ))}
              <button
                onClick={() => setPageDraft(String(pages))}
                className="px-3 py-1.5 rounded-full active:scale-95 transition-all"
                style={{
                  background: C.dSoft, color: C.a,
                  fontFamily: "var(--font-sans)", fontSize: "11.5px", fontWeight: 600,
                }}
              >
                Terminar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mt-4">
            <button
              onClick={openUpdater}
              className="px-7 py-3 rounded-full font-semibold active:scale-95 transition-all"
              style={{
                background: C.a, color: "white",
                fontFamily: "var(--font-sans)", fontSize: "14px",
                boxShadow: `0 4px 14px ${C.aGlow}`,
              }}
            >
              Actualizar avance
            </button>
          </div>
        )}
      </div>

      {/* ── Marcar como leído ── */}
      <button
        onClick={onToggleRead}
        className="w-full flex items-center gap-3.5 p-4 rounded-2xl text-left active:scale-98 transition-all"
        style={{ background: read ? C.aPale : C.s }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
          style={{
            background: read ? C.a : "transparent",
            border: read ? "none" : `2px solid ${C.sDeep}`,
          }}
        >
          {read && (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 8.5l3 3 6-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: read ? C.a : C.ink }}>
            Leído
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11.5px", color: C.inkMuted, marginTop: "1px" }}>
            {read ? "Terminado — cuenta en tu colección" : "Marca la casilla cuando lo termines"}
          </p>
        </div>
      </button>

      {/* ── Estrellas ganadas — 10 % ACENTO ── */}
      <div className="flex items-center gap-1.5 mt-3 mb-5 px-1">
        <span style={{ fontSize: "13px", opacity: stars ? 1 : 0.35 }}>⭐</span>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: "12.5px", fontWeight: 600,
          color: stars ? C.a : C.inkFaint,
        }}>
          {stars} {stars === 1 ? "estrella" : "estrellas"} en tu colección
        </span>
      </div>

      {/* ── Historial ── */}
      <div className="flex items-center gap-2 mb-2.5">
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 700, color: C.ink }}>
          Historial de lectura
        </h3>
        <div className="flex-1" style={{ height: "1px", background: C.sDark, opacity: 0.5 }} />
      </div>

      {log.length === 0 ? (
        <div className="py-7 flex flex-col items-center gap-1.5">
          <span style={{ fontSize: "22px", opacity: 0.35 }}>📖</span>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkFaint }}>
            Todavía no registras avances
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {[...log].reverse().map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 p-3.5 rounded-2xl animate-scale-in"
              style={{ background: C.s }}
            >
              <div className="flex-1">
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", fontWeight: 600, color: C.ink }}>
                  {formatDate(entry.date)}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "11.5px", color: C.inkMid, marginTop: "2px" }}>
                  Página {entry.fromPage} → {entry.toPage}
                  <span style={{ color: C.sDeep }}> · </span>
                  {entry.toPage - entry.fromPage} páginas
                </p>
              </div>
              <button
                onClick={() => onDeleteEntry(entry.id)}
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                style={{ background: `${C.sDark}70` }}
                aria-label="Eliminar registro"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 4h11M6.5 4V2.5h3V4M4 4l.7 9.2a1 1 0 001 .8h4.6a1 1 0 001-.8L12 4"
                    stroke={C.a} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.6 6.8v4.6M9.4 6.8v4.6" stroke={C.a} strokeWidth="1.3" strokeLinecap="round" opacity="0.6"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
