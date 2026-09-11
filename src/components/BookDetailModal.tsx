import { useState, type ReactNode } from "react";
import type { Book, Edition, Quote, ReadingEntry } from "../data";
import { shelves, loans } from "../data";
import BookTracking from "./BookTracking";
import { C } from "../theme";

type View = "info" | "tracking";

export default function BookDetailModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const shelf = shelves.find((s) => s.id === book.shelfId);
  const loan  = loans.find((l) => l.bookId === book.id && !l.returned);

  /* Vista activa del selector */
  const [view, setView] = useState<View>("info");

  /* Sinopsis plegada por defecto */
  const [synopsisOpen, setSynopsisOpen] = useState(false);

  /* Seguimiento de lectura */
  const [read, setRead]               = useState(book.read);
  const [currentPage, setCurrentPage] = useState(book.currentPage);
  const [log, setLog]                 = useState<ReadingEntry[]>(book.readingLog);

  const today = () => new Date().toISOString().slice(0, 10);

  const addEntry = (from: number, to: number) =>
    setLog((prev) => [...prev, { id: `e-${Date.now()}`, date: today(), fromPage: from, toPage: to }]);

  /* Registra el salto de página y sincroniza el estado de leído */
  const handleProgress = (to: number) => {
    if (to === currentPage) return;
    addEntry(currentPage, to);
    setCurrentPage(to);
    setRead(to >= book.pages);
  };

  const handleToggleRead = () => {
    if (read) {
      setRead(false);
      return;
    }
    if (currentPage < book.pages) addEntry(currentPage, book.pages);
    setCurrentPage(book.pages);
    setRead(true);
  };

  /* Al borrar un registro, la página actual vuelve al último avance que queda */
  const handleDeleteEntry = (id: string) => {
    const next = log.filter((e) => e.id !== id);
    const last = next.length > 0 ? next[next.length - 1].toPage : 0;
    setLog(next);
    setCurrentPage(last);
    setRead(last >= book.pages);
  };

  const percent = book.pages > 0 ? Math.round((currentPage / book.pages) * 100) : 0;

  /* Reseña personal */
  const [review, setReview]           = useState(book.review ?? "");
  const [editingReview, setEditing]   = useState(false);
  const [reviewDraft, setReviewDraft] = useState(book.review ?? "");

  /* Frases */
  const [quotes, setQuotes]       = useState<Quote[]>(book.quotes);
  const [addingQuote, setAdding]  = useState(false);
  const [quoteDraft, setQuoteDraft] = useState("");
  const [pageDraft, setPageDraft]   = useState("");

  const saveReview = () => {
    setReview(reviewDraft.trim());
    setEditing(false);
  };

  const cancelReview = () => {
    setReviewDraft(review);
    setEditing(false);
  };

  const saveQuote = () => {
    const text = quoteDraft.trim();
    if (!text) return;
    const page = parseInt(pageDraft, 10);
    setQuotes([
      ...quotes,
      { id: `q-${Date.now()}`, text, page: Number.isNaN(page) ? undefined : page },
    ]);
    setQuoteDraft("");
    setPageDraft("");
    setAdding(false);
  };

  const removeQuote = (id: string) => setQuotes(quotes.filter((q) => q.id !== id));

  return (
    <div className="absolute inset-0 flex flex-col animate-slide-right" style={{ background: C.d, zIndex: 50 }}>

      {/* ── Hero portada ── */}
      <div className="relative shrink-0" style={{ height: "280px", background: book.color }}>
        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.65) 100%)" }} />

        {/* Botón volver */}
        <button onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)" }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Rating — acento 10 % */}
        <div className="absolute top-4 right-4 flex items-center gap-0.5 px-2.5 py-1.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.28)", backdropFilter: "blur(8px)" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="10" height="10" viewBox="0 0 10 10">
              <path d="M5 1l1.2 2.5L9 4l-2 1.9.5 2.6L5 7.3 2.5 8.5 3 5.9 1 4l2.8-.5L5 1z"
                fill={i < book.rating ? C.a : "rgba(255,255,255,0.22)"}/>
            </svg>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          {shelf && (
            <span className="inline-block px-2.5 py-1 rounded-full mb-2"
              style={{ background: `${C.a}cc`, color: "white", fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 600 }}>
              {shelf.icon} {shelf.name}
            </span>
          )}
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, color: "white", lineHeight: 1.2 }}>
            {book.title}
          </h2>
          <p style={{ fontFamily: "var(--font-lora)", fontSize: "14px", color: "rgba(255,255,255,0.75)", fontStyle: "italic", marginTop: "2px" }}>
            {book.author}
          </p>
        </div>
      </div>

      {/* ── Selector de vista — justo debajo de la portada ── */}
      <div className="shrink-0 px-5 pt-4 pb-1">
        <div className="flex p-1 rounded-2xl" style={{ background: C.s }}>
          <ViewTab label="Información" active={view === "info"}     onClick={() => setView("info")} />
          <ViewTab label="Seguimiento" active={view === "tracking"} onClick={() => setView("tracking")}
            badge={`${percent}%`} />
        </div>
      </div>

      {/* ── Detalle ── */}
      <div className="flex-1 overflow-y-auto">
        {view === "tracking" ? (
          <BookTracking
            pages={book.pages}
            currentPage={currentPage}
            read={read}
            log={log}
            onProgress={handleProgress}
            onToggleRead={handleToggleRead}
            onDeleteEntry={handleDeleteEntry}
          />
        ) : (
        <div className="p-5 animate-fade-in">

          {/* Status badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: read ? C.aPale : C.s,
                color: read ? C.a : C.inkMuted,
                fontFamily: "var(--font-sans)",
              }}>
              {read ? "✓ Leído" : currentPage > 0 ? `◐ Leyendo · ${percent}%` : "◯ Por leer"}
            </span>
            {loan && (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: C.errPale, color: C.err, fontFamily: "var(--font-sans)" }}>
                Prestado a {loan.borrower}
              </span>
            )}
          </div>

          {/* Meta grid — 30 % ESTRUCTURA */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[["Año", String(book.year)], ["Páginas", String(book.pages)], ["Género", book.genre]].map(([label, val]) => (
              <div key={label} className="flex flex-col items-center py-3 rounded-2xl" style={{ background: C.s }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: label === "Género" ? "12px" : "18px", fontWeight: 700, color: C.ink }}>
                  {val}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: C.inkMuted, marginTop: "2px" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* ── Ficha del ejemplar — 30 % ESTRUCTURA ── */}
          <div className="rounded-2xl overflow-hidden mb-5" style={{ background: C.s }}>
            <InfoRow
              icon={<EditionIcon edition={book.edition} />}
              label="Edición"
              value={book.edition}
            />
            <Divider />
            <InfoRow
              icon={
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7.5" stroke={C.a} strokeWidth="1.6"/>
                  <path d="M2.5 10h15M10 2.5c2 2.3 3 4.8 3 7.5s-1 5.2-3 7.5c-2-2.3-3-4.8-3-7.5s1-5.2 3-7.5z"
                    stroke={C.a} strokeWidth="1.4"/>
                </svg>
              }
              label="Idioma"
              value={book.language}
            />
            <Divider />
            <InfoRow
              icon={
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <rect x="2.5" y="3"  width="15" height="2" rx="1" fill={C.a}/>
                  <rect x="2.5" y="9"  width="15" height="2" rx="1" fill={C.a} opacity="0.75"/>
                  <rect x="2.5" y="15" width="15" height="2" rx="1" fill={C.a} opacity="0.5"/>
                  <rect x="5"   y="5"  width="1.8" height="4" rx="0.6" fill={C.a} opacity="0.55"/>
                  <rect x="8.5" y="5"  width="1.8" height="4" rx="0.6" fill={C.a} opacity="0.55"/>
                  <rect x="7"   y="11" width="1.8" height="4" rx="0.6" fill={C.a} opacity="0.55"/>
                  <rect x="11"  y="11" width="1.8" height="4" rx="0.6" fill={C.a} opacity="0.55"/>
                </svg>
              }
              label="Librero"
              value={shelf ? `${shelf.icon} ${shelf.name}` : "Sin asignar"}
            />
            <Divider />
            <InfoRow
              icon={
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <rect x="3"    y="4" width="1.8" height="12" rx="0.9" fill={C.a}/>
                  <rect x="6"    y="4" width="0.9" height="12" rx="0.45" fill={C.a} opacity="0.8"/>
                  <rect x="8.2"  y="4" width="1.8" height="12" rx="0.9" fill={C.a} opacity="0.65"/>
                  <rect x="11.4" y="4" width="0.9" height="12" rx="0.45" fill={C.a} opacity="0.8"/>
                  <rect x="13.6" y="4" width="1.8" height="12" rx="0.9" fill={C.a}/>
                </svg>
              }
              label="ISBN"
              value={book.isbn}
              mono
            />
          </div>

          {/* ── Sinopsis ── */}
          <SectionTitle title="Sinopsis" />
          <p
            className={synopsisOpen ? "" : "line-clamp-4"}
            style={{
              fontFamily: "var(--font-lora)",
              fontSize: "13.5px",
              lineHeight: 1.72,
              color: C.inkMid,
              marginBottom: "6px",
            }}
          >
            {book.synopsis}
          </p>
          <button
            onClick={() => setSynopsisOpen(!synopsisOpen)}
            style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600, color: C.a }}
            className="mb-5"
          >
            {synopsisOpen ? "Leer menos" : "Leer más"}
          </button>

          {/* ── Reseña personal ── */}
          <SectionTitle
            title="Mi reseña"
            action={
              !editingReview && review
                ? { label: "Editar", onClick: () => { setReviewDraft(review); setEditing(true); } }
                : undefined
            }
          />

          {editingReview ? (
            <div className="rounded-2xl p-3.5 mb-5" style={{ background: C.s }}>
              <textarea
                autoFocus
                value={reviewDraft}
                onChange={(e) => setReviewDraft(e.target.value)}
                placeholder="¿Qué te dejó este libro?"
                rows={5}
                className="w-full resize-none outline-none bg-transparent"
                style={{
                  fontFamily: "var(--font-lora)",
                  fontSize: "13.5px",
                  lineHeight: 1.7,
                  color: C.ink,
                }}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={saveReview}
                  className="flex-1 py-2.5 rounded-xl font-semibold active:scale-95 transition-all"
                  style={{ background: C.a, color: "white", fontFamily: "var(--font-sans)", fontSize: "13px" }}
                >
                  Guardar reseña
                </button>
                <button
                  onClick={cancelReview}
                  className="px-4 py-2.5 rounded-xl font-medium active:scale-95 transition-all"
                  style={{ background: C.dSoft, color: C.inkMid, fontFamily: "var(--font-sans)", fontSize: "13px" }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : review ? (
            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: C.s, borderLeft: `3px solid ${C.a}` }}
            >
              <p style={{ fontFamily: "var(--font-lora)", fontSize: "13.5px", lineHeight: 1.72, color: C.inkMid }}>
                {review}
              </p>
            </div>
          ) : (
            <button
              onClick={() => { setReviewDraft(""); setEditing(true); }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed mb-5 active:scale-95 transition-all"
              style={{ borderColor: `${C.a}35`, color: C.a }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M11.2 2.3l2.5 2.5-8 8-3.2.7.7-3.2 8-8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500 }}>
                Añadir reseña personal
              </span>
            </button>
          )}

          {/* ── Frases ── */}
          <SectionTitle title="Frases" count={quotes.length} />

          <div className="flex flex-col gap-2.5 mb-3">
            {quotes.map((q) => (
              <div
                key={q.id}
                className="relative rounded-2xl p-4 pr-9 animate-scale-in"
                style={{ background: C.dDeep, borderLeft: `3px solid ${C.sDark}` }}
              >
                <span
                  className="absolute"
                  style={{
                    top: "2px", left: "10px",
                    fontFamily: "var(--font-serif)", fontSize: "30px",
                    color: C.a, opacity: 0.22, lineHeight: 1,
                  }}
                >
                  “
                </span>
                <p style={{
                  fontFamily: "var(--font-lora)", fontSize: "13.5px", fontStyle: "italic",
                  lineHeight: 1.7, color: C.ink, position: "relative",
                }}>
                  {q.text}
                </p>
                {q.page !== undefined && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "10.5px", color: C.inkMuted, marginTop: "6px" }}>
                    pág. {q.page}
                  </p>
                )}
                <button
                  onClick={() => removeQuote(q.id)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                  style={{ background: `${C.sDark}55` }}
                  aria-label="Eliminar frase"
                >
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1l8 8M9 1l-8 8" stroke={C.inkMid} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}

            {quotes.length === 0 && !addingQuote && (
              <div className="py-5 flex flex-col items-center gap-1.5">
                <span style={{ fontSize: "22px", opacity: 0.35 }}>✍️</span>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkFaint }}>
                  Aún no has guardado frases
                </p>
              </div>
            )}
          </div>

          {addingQuote ? (
            <div className="rounded-2xl p-3.5 mb-5 animate-scale-in" style={{ background: C.s }}>
              <textarea
                autoFocus
                value={quoteDraft}
                onChange={(e) => setQuoteDraft(e.target.value)}
                placeholder="Escribe o pega la frase…"
                rows={3}
                className="w-full resize-none outline-none bg-transparent"
                style={{
                  fontFamily: "var(--font-lora)", fontSize: "13.5px", fontStyle: "italic",
                  lineHeight: 1.7, color: C.ink,
                }}
              />
              <div className="flex items-center gap-2 mt-2">
                <input
                  value={pageDraft}
                  onChange={(e) => setPageDraft(e.target.value.replace(/\D/g, ""))}
                  placeholder="Pág."
                  inputMode="numeric"
                  className="w-16 px-3 py-2.5 rounded-xl outline-none"
                  style={{
                    background: C.dSoft, color: C.ink,
                    fontFamily: "var(--font-sans)", fontSize: "13px",
                  }}
                />
                <button
                  onClick={saveQuote}
                  disabled={!quoteDraft.trim()}
                  className="flex-1 py-2.5 rounded-xl font-semibold active:scale-95 transition-all"
                  style={{
                    background: quoteDraft.trim() ? C.a : C.sDark,
                    color: "white",
                    opacity: quoteDraft.trim() ? 1 : 0.6,
                    fontFamily: "var(--font-sans)", fontSize: "13px",
                  }}
                >
                  Guardar frase
                </button>
                <button
                  onClick={() => { setAdding(false); setQuoteDraft(""); setPageDraft(""); }}
                  className="px-4 py-2.5 rounded-xl font-medium active:scale-95 transition-all"
                  style={{ background: C.dSoft, color: C.inkMid, fontFamily: "var(--font-sans)", fontSize: "13px" }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed mb-5 active:scale-95 transition-all"
              style={{ borderColor: `${C.a}35`, color: C.a }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500 }}>Añadir frase</span>
            </button>
          )}

          {/* Buttons — 10 % ACENTO primario, 30 % secundario */}
          <div className="flex gap-3">
            <button
              onClick={() => (read ? setView("tracking") : handleToggleRead())}
              className="flex-1 py-3.5 rounded-2xl font-semibold active:scale-95 transition-all"
              style={{ background: C.a, color: "white", fontFamily: "var(--font-sans)", fontSize: "14px", boxShadow: `0 4px 14px ${C.aGlow}` }}>
              {read ? "Ver seguimiento" : "Marcar leído"}
            </button>
            <button className="flex-1 py-3.5 rounded-2xl font-semibold active:scale-95 transition-all"
              style={{ background: C.s, color: C.inkMid, fontFamily: "var(--font-sans)", fontSize: "14px" }}>
              Prestar
            </button>
          </div>

          <button className="w-full mt-2.5 py-3 rounded-2xl font-medium active:scale-95 transition-all"
            style={{ background: C.s, color: C.inkMuted, fontFamily: "var(--font-sans)", fontSize: "13px" }}>
            Editar información
          </button>
        </div>
        )}
      </div>
    </div>
  );
}

/* ── Pestaña del selector de vista ───────────────────────────── */
function ViewTab({ label, active, onClick, badge }: {
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all"
      style={{
        background: active ? C.d : "transparent",
        boxShadow: active ? "0 2px 6px rgba(42,56,48,0.12)" : "none",
      }}
    >
      <span style={{
        fontFamily: "var(--font-sans)",
        fontSize: "13px",
        fontWeight: active ? 600 : 500,
        color: active ? C.a : C.inkMid,
        transition: "color 0.18s",
      }}>
        {label}
      </span>
      {badge && (
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: "10px",
          fontWeight: 600,
          color: active ? C.a : C.inkMuted,
          background: active ? C.aPale : `${C.sDark}70`,
          padding: "1px 6px",
          borderRadius: "99px",
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* ── Encabezado de sección ───────────────────────────────────── */
function SectionTitle({ title, count, action }: {
  title: string;
  count?: number;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 700, color: C.ink }}>
        {title}
      </h3>
      {count !== undefined && count > 0 && (
        <span className="px-2 py-0.5 rounded-full"
          style={{ background: C.aPale, color: C.a, fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 600 }}>
          {count}
        </span>
      )}
      <div className="flex-1" style={{ height: "1px", background: C.sDark, opacity: 0.5 }} />
      {action && (
        <button onClick={action.onClick}
          style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600, color: C.a }}>
          {action.label}
        </button>
      )}
    </div>
  );
}

/* ── Fila de ficha técnica ───────────────────────────────────── */
function InfoRow({ icon, label, value, mono }: {
  icon: ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${C.a}15` }}>
        {icon}
      </div>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMid }}>
        {label}
      </span>
      <span className="flex-1 text-right" style={{
        fontFamily: mono ? "DM Mono, monospace" : "var(--font-sans)",
        fontSize: mono ? "12px" : "12.5px",
        fontWeight: mono ? 400 : 600,
        color: C.ink,
      }}>
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: C.sDark, opacity: 0.45, marginLeft: "56px" }} />;
}

/* ── Icono según el formato del ejemplar ─────────────────────── */
function EditionIcon({ edition }: { edition: Edition }) {
  if (edition === "eBook") {
    return (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <rect x="4" y="2" width="12" height="16" rx="2" stroke={C.a} strokeWidth="1.6"/>
        <path d="M7 6h6M7 9h6M7 12h4" stroke={C.a} strokeWidth="1.3" strokeLinecap="round" opacity="0.7"/>
      </svg>
    );
  }
  if (edition === "Audiolibro") {
    return (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M3.5 12V9a6.5 6.5 0 0113 0v3" stroke={C.a} strokeWidth="1.6" strokeLinecap="round"/>
        <rect x="2" y="11" width="3.5" height="5.5" rx="1.75" fill={C.a}/>
        <rect x="14.5" y="11" width="3.5" height="5.5" rx="1.75" fill={C.a}/>
      </svg>
    );
  }
  if (edition === "CD" || edition === "DVD") {
    return (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke={C.a} strokeWidth="1.6"/>
        <circle cx="10" cy="10" r="2.2" fill={C.a}/>
        <path d="M10 2.5a7.5 7.5 0 015.3 2.2" stroke={C.a} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      </svg>
    );
  }
  if (edition === "Edición de bolsillo") {
    return (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <rect x="5.5" y="3" width="9" height="14" rx="1.5" stroke={C.a} strokeWidth="1.6"/>
        <path d="M8 3v14" stroke={C.a} strokeWidth="1.2" opacity="0.6"/>
      </svg>
    );
  }
  /* Tapa blanda / tapa dura */
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M3 4.5A1.5 1.5 0 014.5 3H9v14H4.5A1.5 1.5 0 013 15.5v-11z"
        fill={edition === "Tapa dura" ? C.a : "none"} stroke={C.a} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M17 4.5A1.5 1.5 0 0015.5 3H11v14h4.5a1.5 1.5 0 001.5-1.5v-11z"
        stroke={C.a} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
