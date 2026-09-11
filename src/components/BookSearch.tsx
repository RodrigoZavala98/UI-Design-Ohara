import { useEffect, useState } from "react";
import { C } from "../theme";

export type SearchResult = {
  key: string;
  title: string;
  author: string;
  year?: number;
  pages?: number;
  isbn?: string;
  language?: string;
  coverUrl?: string;
};

/* Respuesta de openlibrary.org/search.json — solo los campos que pedimos */
type Doc = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  number_of_pages_median?: number;
  isbn?: string[];
  language?: string[];
};

const MIN_CHARS = 3;
const DEBOUNCE_MS = 400;

/* Códigos MARC del catálogo → los idiomas que ofrece el formulario */
const LANG_CODES: Record<string, string> = {
  spa: "Español", eng: "Inglés", fre: "Francés", fra: "Francés",
  ita: "Italiano", por: "Portugués", ger: "Alemán", deu: "Alemán",
};

/*
 * El catálogo lista los idiomas de todas las ediciones sin orden de relevancia,
 * así que preferimos el español y, si no está, el primero que reconozcamos.
 */
function pickLanguage(codes?: string[]): string | undefined {
  if (!codes || codes.length === 0) return undefined;
  if (codes.includes("spa")) return LANG_CODES.spa;
  const known = codes.find((c) => c in LANG_CODES);
  return known ? LANG_CODES[known] : undefined;
}

function toResult(doc: Doc): SearchResult {
  return {
    key:      doc.key,
    title:    doc.title,
    author:   doc.author_name?.[0] ?? "Autor desconocido",
    year:     doc.first_publish_year,
    pages:    doc.number_of_pages_median,
    isbn:     doc.isbn?.[0],
    language: pickLanguage(doc.language),
    coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
  };
}

export default function BookSearch({ query, onQueryChange, onPick, onManual }: {
  /* La consulta vive en el modal para no perderla al volver del formulario */
  query: string;
  onQueryChange: (v: string) => void;
  onPick: (r: SearchResult) => void;
  onManual: () => void;
}) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);   /* fuerza el reintento */

  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed.length < MIN_CHARS) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    /* Espera a que el usuario deje de escribir antes de consultar */
    const timer = setTimeout(async () => {
      try {
        const url =
          "https://openlibrary.org/search.json" +
          `?title=${encodeURIComponent(trimmed)}` +
          "&limit=12" +
          "&fields=key,title,author_name,first_publish_year,cover_i,number_of_pages_median,isbn,language";
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { docs?: Doc[] };
        setResults((data.docs ?? []).map(toResult));
        setLoading(false);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;   /* búsqueda reemplazada */
        setError("No pudimos consultar el catálogo");
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [trimmed, attempt]);

  return (
    <div>
      {/* ── Campo de búsqueda — 30 % ESTRUCTURA ── */}
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-4"
        style={{ background: C.s, border: "2px solid transparent" }}>
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" className="shrink-0">
          <circle cx="8.8" cy="8.8" r="5.8" stroke={C.a} strokeWidth="1.8"/>
          <path d="M13.2 13.2L17 17" stroke={C.a} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input
          autoFocus
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Escribe el título del libro…"
          className="flex-1 bg-transparent outline-none min-w-0"
          style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: C.ink }}
        />
        {query && (
          <button onClick={() => onQueryChange("")} className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: `${C.sDark}90` }} aria-label="Limpiar búsqueda">
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1l-8 8" stroke={C.inkMid} strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── Estados ── */}
      {trimmed.length < MIN_CHARS && (
        <div className="py-10 flex flex-col items-center gap-2 px-6 text-center">
          <span style={{ fontSize: "26px", opacity: 0.35 }}>🔍</span>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: C.inkFaint }}>
            Escribe al menos {MIN_CHARS} letras y buscamos el libro por ti
          </p>
        </div>
      )}

      {loading && <Skeletons />}

      {!loading && error && (
        <div className="py-8 flex flex-col items-center gap-3 px-6 text-center">
          <span style={{ fontSize: "24px", opacity: 0.45 }}>📡</span>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: C.inkMid }}>{error}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setAttempt((a) => a + 1)}
              className="px-4 py-2.5 rounded-xl font-semibold active:scale-95 transition-all"
              style={{ background: C.a, color: "white", fontFamily: "var(--font-sans)", fontSize: "13px" }}
            >
              Reintentar
            </button>
            <button
              onClick={onManual}
              className="px-4 py-2.5 rounded-xl font-medium active:scale-95 transition-all"
              style={{ background: C.s, color: C.inkMid, fontFamily: "var(--font-sans)", fontSize: "13px" }}
            >
              Rellenar a mano
            </button>
          </div>
        </div>
      )}

      {!loading && !error && trimmed.length >= MIN_CHARS && results.length === 0 && (
        <div className="py-8 flex flex-col items-center gap-3 px-6 text-center">
          <span style={{ fontSize: "24px", opacity: 0.35 }}>📭</span>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: C.inkFaint }}>
            Sin resultados para “{trimmed}”
          </p>
          <button
            onClick={onManual}
            className="px-4 py-2.5 rounded-xl font-medium active:scale-95 transition-all"
            style={{ background: C.s, color: C.inkMid, fontFamily: "var(--font-sans)", fontSize: "13px" }}
          >
            Añadirlo a mano
          </button>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, marginBottom: "10px" }}>
            {results.length} coincidencias
          </p>
          <div className="flex flex-col gap-2">
            {results.map((r) => (
              <button
                key={r.key}
                onClick={() => onPick(r)}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl text-left active:scale-98 transition-all"
                style={{ background: C.s }}
              >
                <Cover result={r} />
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-2" style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>
                    {r.title}
                  </p>
                  <p className="truncate" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMid, marginTop: "2px" }}>
                    {r.author}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: C.inkMuted, marginTop: "2px" }}>
                    {[r.year, r.pages ? `${r.pages} págs.` : null].filter(Boolean).join(" · ") || "Sin datos de edición"}
                  </p>
                </div>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <path d="M6 4l4 4-4 4" stroke={C.a} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>

          <button
            onClick={onManual}
            className="w-full mt-3 py-3 rounded-2xl font-medium active:scale-95 transition-all"
            style={{ background: "transparent", color: C.a, fontFamily: "var(--font-sans)", fontSize: "13px" }}
          >
            No encuentro mi libro, lo relleno a mano
          </button>
        </>
      )}
    </div>
  );
}

/* ── Portada del resultado, con respaldo si el catálogo no tiene imagen ── */
function Cover({ result }: { result: SearchResult }) {
  const [failed, setFailed] = useState(false);

  if (!result.coverUrl || failed) {
    return (
      <div className="rounded-xl flex items-center justify-center shrink-0"
        style={{ width: "44px", height: "64px", background: C.dDeep }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 20V6l7-2.5L19 6v14" stroke={C.inkFaint} strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M12 3.5V20" stroke={C.inkFaint} strokeWidth="1.4"/>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={result.coverUrl}
      alt={result.title}
      onError={() => setFailed(true)}
      className="rounded-xl object-cover shrink-0"
      style={{ width: "44px", height: "64px", background: C.dDeep }}
    />
  );
}

/* ── Esqueletos de carga ── */
function Skeletons() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 p-2.5 rounded-2xl"
          style={{ background: C.s, opacity: 1 - i * 0.18 }}>
          <div className="rounded-xl shrink-0" style={{ width: "44px", height: "64px", background: C.dDeep }} />
          <div className="flex-1 flex flex-col gap-2">
            <div style={{ height: "11px", width: "72%", background: C.dDeep, borderRadius: "99px" }} />
            <div style={{ height: "9px",  width: "45%", background: C.dDeep, borderRadius: "99px" }} />
            <div style={{ height: "9px",  width: "30%", background: C.dDeep, borderRadius: "99px" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
