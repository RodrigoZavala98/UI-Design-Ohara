import { useState } from "react";
import { EDITIONS, GENRES, LANGUAGES, shelves } from "../data";
import BookSearch, { type SearchResult } from "./BookSearch";
import { C } from "../theme";

type Step = "method" | "scan" | "search" | "form";

const emptyForm = {
  title: "", author: "", year: "", pages: "", isbn: "",
  genre: "Literatura",
  language: "Español",
  edition: "Tapa blanda" as string,
  shelfId: "s1",
};

export default function AddBookModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("method");
  const [form, setForm] = useState(emptyForm);
  const [cover, setCover] = useState<string | null>(null);
  const [fromCatalog, setFromCatalog] = useState(false);
  const [query, setQuery] = useState("");
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  /* Un resultado del catálogo precarga el formulario para revisarlo antes de guardar */
  const pickResult = (r: SearchResult) => {
    setForm((p) => ({
      ...p,
      title:    r.title,
      author:   r.author,
      year:     r.year  ? String(r.year)  : "",
      pages:    r.pages ? String(r.pages) : "",
      isbn:     r.isbn ?? "",
      language: r.language ?? p.language,
    }));
    setCover(r.coverUrl ?? null);
    setFromCatalog(true);
    setStep("form");
  };

  const openManual = () => {
    setFromCatalog(false);
    setStep("form");
  };

  return (
    /* 60 % DOMINANTE de fondo */
    <div className="absolute inset-0 flex flex-col animate-slide-up" style={{ background: C.d, zIndex: 60, borderRadius: "44px" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: C.inkMuted, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Biblioteca
          </p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 700, color: C.ink }}>Añadir libro</h2>
        </div>
        {/* Cerrar — 30 % */}
        <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.s }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke={C.inkMid} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── Método ── */}
        {step === "method" && (
          <div className="px-6 pt-1 animate-fade-in">
            <p style={{ fontFamily: "var(--font-lora)", fontSize: "14px", color: C.inkMuted, fontStyle: "italic", marginBottom: "22px" }}>
              ¿Cómo quieres añadir el libro?
            </p>

            {/* Escanear — 30 % estructura oscura */}
            <button onClick={() => setStep("scan")}
              className="w-full flex items-center gap-4 p-5 rounded-3xl mb-3 text-left active:scale-98 transition-all"
              style={{ background: C.sDark }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${C.a}28` }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <rect x="3" y="8" width="20" height="10" rx="2" stroke={C.a} strokeWidth="1.8"/>
                  <path d="M8 8V6M13 8V5M18 8V6" stroke={C.a} strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M7 13h2M11 11h1v4M15 13h3" stroke={C.a} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 600, color: C.ink }}>Escanear ISBN</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMuted, marginTop: "2px" }}>
                  Usa la cámara para identificar automáticamente
                </p>
              </div>
            </button>

            {/* Buscar por título — 30 % con icono de acento */}
            <button onClick={() => setStep("search")}
              className="w-full flex items-center gap-4 p-5 rounded-3xl mb-3 text-left active:scale-98 transition-all"
              style={{ background: C.s }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${C.a}28` }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <circle cx="11.5" cy="11.5" r="7.5" stroke={C.a} strokeWidth="1.8"/>
                  <path d="M17 17l5 5" stroke={C.a} strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M8.5 10.5h6M8.5 13.5h4" stroke={C.a} strokeWidth="1.5" strokeLinecap="round" opacity="0.65"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 600, color: C.ink }}>Buscar por título</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMuted, marginTop: "2px" }}>
                  Escribe el nombre y lo encontramos por ti
                </p>
              </div>
            </button>

            {/* Manual — 30 % */}
            <button onClick={openManual}
              className="w-full flex items-center gap-4 p-5 rounded-3xl text-left active:scale-98 transition-all"
              style={{ background: C.s }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: C.dDeep }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M5 21V8l8-3 8 3v13" stroke={C.inkMid} strokeWidth="1.8" strokeLinejoin="round"/>
                  <rect x="9" y="13" width="8" height="8" rx="1" stroke={C.inkMid} strokeWidth="1.8"/>
                  <path d="M13 13v8M9 17h8" stroke={C.inkMid} strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 600, color: C.ink }}>Rellenar campos</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMuted, marginTop: "2px" }}>
                  Introduce los datos manualmente
                </p>
              </div>
            </button>

            <div className="mt-8">
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, marginBottom: "10px" }}>
                Añadidos recientemente
              </p>
              {["Rayuela", "Veinte poemas de amor"].map((t) => (
                <div key={t} className="flex items-center gap-3 py-2.5" style={{ borderBottom: `1px solid ${C.sDark}` }}>
                  <div className="w-8 h-11 rounded-lg" style={{ background: C.s }} />
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "14px", color: C.inkMid }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Escáner ── */}
        {step === "scan" && (
          <div className="px-6 pt-2 animate-fade-in">
            <BackBtn onClick={() => setStep("method")} />
            {/* Visor — 30 % ESTRUCTURA */}
            <div className="rounded-3xl overflow-hidden mb-4 relative" style={{ height: "300px", background: C.sDark }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-40 relative">
                  {[{t:0,l:0},{t:0,r:0},{b:0,l:0},{b:0,r:0}].map((pos, i) => (
                    <div key={i} className="absolute w-6 h-6" style={{
                      ...pos,
                      borderColor: C.a,
                      borderTopWidth:    "top"    in pos ? "2px" : 0,
                      borderLeftWidth:   "left"   in pos ? "2px" : 0,
                      borderBottomWidth: "bottom" in pos ? "2px" : 0,
                      borderRightWidth:  "right"  in pos ? "2px" : 0,
                      borderStyle: "solid",
                    }} />
                  ))}
                  <div className="absolute left-0 right-0 h-px"
                    style={{ top: "50%", background: `linear-gradient(to right, transparent, ${C.a}, transparent)`, opacity: 0.8 }} />
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMuted }}>
                  Apunta al código de barras del libro
                </p>
              </div>
            </div>
            <Btn onClick={openManual}>Rellenar manualmente</Btn>
          </div>
        )}

        {/* ── Búsqueda por título ── */}
        {step === "search" && (
          <div className="px-6 pt-2 pb-6 animate-fade-in">
            <BackBtn onClick={() => setStep("method")} />
            <BookSearch query={query} onQueryChange={setQuery} onPick={pickResult} onManual={openManual} />
          </div>
        )}

        {/* ── Formulario ── */}
        {step === "form" && (
          <div className="px-6 pt-2 pb-6 animate-fade-in">
            <BackBtn onClick={() => setStep(fromCatalog ? "search" : "method")} />

            {fromCatalog && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl mb-4" style={{ background: C.aPale }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
                  <circle cx="10" cy="10" r="7.5" stroke={C.a} strokeWidth="1.6"/>
                  <path d="M10 6.2v.1M10 9v4.6" stroke={C.a} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMid, lineHeight: 1.5 }}>
                  Datos traídos del catálogo. Revísalos y corrige lo que haga falta antes de guardar.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Field label="Título"  value={form.title}  onChange={(v) => set("title", v)}  placeholder="El nombre de la rosa" />
              <Field label="Autor"   value={form.author} onChange={(v) => set("author", v)} placeholder="Umberto Eco" />
              <div className="flex gap-3">
                <div className="flex-1"><Field label="Año"     value={form.year}  onChange={(v) => set("year", v)}  placeholder="1980" type="number" /></div>
                <div className="flex-1"><Field label="Páginas" value={form.pages} onChange={(v) => set("pages", v)} placeholder="502"  type="number" /></div>
              </div>
              <Field label="ISBN" value={form.isbn} onChange={(v) => set("isbn", v)} placeholder="978-0-15-144647-6" />

              <Select label="Género"          options={GENRES}    value={form.genre}    onChange={(v) => set("genre", v)} />
              <Select label="Idioma"          options={LANGUAGES} value={form.language} onChange={(v) => set("language", v)} />
              <Select label="Tipo de edición" options={EDITIONS}  value={form.edition}  onChange={(v) => set("edition", v)} />

              <Chips
                label="Librero"
                options={shelves.map((s) => ({ value: s.id, label: `${s.icon} ${s.name}` }))}
                value={form.shelfId}
                onChange={(v) => set("shelfId", v)}
              />

              {/* Portada */}
              <div>
                <Label>Portada</Label>
                {cover ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: C.s }}>
                    <img src={cover} alt="Portada encontrada" className="rounded-xl object-cover shrink-0"
                      style={{ width: "48px", height: "70px", background: C.dDeep }}
                      onError={() => setCover(null)} />
                    <div className="flex-1">
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", fontWeight: 600, color: C.ink }}>
                        Portada del catálogo
                      </p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: C.inkMuted, marginTop: "1px" }}>
                        Se guardará con el libro
                      </p>
                    </div>
                    <button onClick={() => setCover(null)}
                      style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600, color: C.a }}>
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-2xl border-2 border-dashed gap-2 py-5"
                    style={{ borderColor: `${C.a}35` }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4v8M7 7l3-3 3 3" stroke={C.a} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 14v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke={C.a} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: C.a }}>Subir imagen</span>
                  </div>
                )}
              </div>

              <Btn onClick={onClose}>Guardar libro</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Primitivos ────────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl outline-none transition-all"
        style={{ background: C.s, fontFamily: "var(--font-sans)", fontSize: "14px", color: C.ink, border: "2px solid transparent" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = C.a; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = "transparent"; }} />
    </div>
  );
}

/* Lista desplegable — usa el selector nativo, más cómodo en móvil */
function Select({ label, options, value, onChange }: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-4 pr-10 py-3 rounded-xl outline-none appearance-none transition-all"
          style={{
            background: C.s,
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            color: C.ink,
            border: "2px solid transparent",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = C.a; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = "transparent"; }}
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        {/* Flecha propia: el selector nativo oculta la suya con appearance-none */}
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
          className="absolute pointer-events-none"
          style={{ right: "14px", top: "50%", transform: "translateY(-50%)" }}>
          <path d="M4 6l4 4 4-4" stroke={C.a} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

/* Selector de una sola opción — chips que envuelven, todas visibles */
function Chips({ label, options, value, onChange }: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.value;
          return (
            <button key={o.value} onClick={() => onChange(o.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95"
              style={{
                background: on ? C.a : C.s,
                color:      on ? "white" : C.inkMid,
                fontFamily: "var(--font-sans)",
              }}>
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 600, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
      {children}
    </p>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 mb-4"
      style={{ color: C.a, fontFamily: "var(--font-sans)", fontSize: "13px" }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Volver
    </button>
  );
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className="w-full py-4 rounded-2xl font-semibold mt-2 active:scale-95 transition-all"
      style={{ background: C.a, color: "white", fontFamily: "var(--font-sans)", fontSize: "15px", boxShadow: `0 4px 16px ${C.aGlow}` }}>
      {children}
    </button>
  );
}
