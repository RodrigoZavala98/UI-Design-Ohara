import type { Book } from "../data";
import { books } from "../data";
import { C } from "../theme";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

type Finished = { book: Book; date: string };

/* Un libro cuenta como terminado en la fecha del avance que llegó a la última página */
function finishedIn(year: number): Finished[] {
  const out: Finished[] = [];
  for (const b of books) {
    const entry = [...b.readingLog].reverse().find((e) => e.toPage >= b.pages);
    if (entry && entry.date.startsWith(`${year}`)) out.push({ book: b, date: entry.date });
  }
  return out;
}

function pagesReadIn(year: number): number {
  return books.reduce(
    (total, b) =>
      total +
      b.readingLog
        .filter((e) => e.date.startsWith(`${year}`))
        .reduce((sum, e) => sum + (e.toPage - e.fromPage), 0),
    0,
  );
}

export default function YearInBooks() {
  const year      = new Date().getFullYear();
  const finished  = finishedIn(year);
  const pagesRead = pagesReadIn(year);
  const stars     = finished.length;

  /* Meses de diciembre a enero, solo los que tienen libros */
  const groups = Array.from({ length: 12 }, (_, i) => 11 - i)
    .map((month) => ({
      month,
      items: finished.filter((f) => Number(f.date.slice(5, 7)) - 1 === month),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-5 pb-2">

      {/* ── Cabecera del año ── */}
      <div className="flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
          style={{ background: C.a, boxShadow: `0 6px 18px ${C.aGlow}` }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, color: "white" }}>A</span>
        </div>
        <div className="flex-1">
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "30px", fontWeight: 700, color: C.a, lineHeight: 1 }}>
            {year}
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: C.inkMid, marginTop: "3px" }}>
            Mi resumen de lectura
          </p>
        </div>
        {/* Exportar resumen */}
        <button className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-all"
          style={{ background: C.s }} aria-label="Descargar resumen">
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v10M6 9.5l4 4 4-4" stroke={C.a} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.5 16.5h13" stroke={C.a} strokeWidth="1.7" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Métricas — 30 % ESTRUCTURA ── */}
      <div className="grid grid-cols-2 gap-3">
        <Stat value={String(stars)} label={stars === 1 ? "Estrella" : "Estrellas"} />
        <Stat value={pagesRead.toLocaleString("es-MX")} label="Páginas leídas" />
      </div>

      {/* ── Desglose por mes ── */}
      {groups.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-2">
          <span style={{ fontSize: "26px", opacity: 0.35 }}>🌱</span>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: C.inkFaint }}>
            Aún no terminas ningún libro en {year}
          </p>
        </div>
      ) : (
        groups.map((g) => (
          <div key={g.month}>
            {/* Título del mes */}
            <div className="flex items-center gap-3 mb-3">
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", fontWeight: 700, color: C.a }}>
                {MONTHS[g.month]}
              </h3>
              <div className="flex-1" style={{ height: "2px", background: C.a, opacity: 0.85, borderRadius: "1px" }} />
            </div>

            <div className="flex flex-col gap-4">
              {g.items.map(({ book }) => (
                <BookRow key={book.id} book={book} />
              ))}
            </div>
          </div>
        ))
      )}

      <p style={{ textAlign: "center", marginTop: "6px", fontFamily: "var(--font-lora)", fontSize: "12px", color: C.inkFaint, fontStyle: "italic" }}>
        {stars > 0
          ? `${pagesRead.toLocaleString("es-MX")} páginas y las que faltan 🌿`
          : "Tu año apenas empieza 🌿"}
      </p>
    </div>
  );
}

/* ── Tarjeta de métrica ──────────────────────────────────────── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-5 rounded-2xl" style={{ background: C.s }}>
      <span style={{ fontFamily: "var(--font-serif)", fontSize: "30px", fontWeight: 700, color: C.a, lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMid, marginTop: "5px" }}>
        {label}
      </span>
    </div>
  );
}

/* ── Libro terminado ─────────────────────────────────────────── */
function BookRow({ book }: { book: Book }) {
  const quote = book.quotes[0];

  return (
    <div className="flex gap-3.5">
      {/* Portada */}
      <div className="rounded-xl overflow-hidden shrink-0"
        style={{ width: "62px", height: "92px", background: book.color, boxShadow: `0 4px 12px ${book.color}45` }}>
        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 700, color: C.a, lineHeight: 1.25 }}>
          {book.title}
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", color: C.inkMid, marginTop: "2px" }}>
          {book.author} – {book.year}
        </p>

        {/* Calificación */}
        <div className="flex items-center gap-0.5 mt-1.5">
          {Array.from({ length: book.rating }).map((_, i) => (
            <svg key={i} width="13" height="13" viewBox="0 0 10 10">
              <path d="M5 1l1.2 2.5L9 4l-2 1.9.5 2.6L5 7.3 2.5 8.5 3 5.9 1 4l2.8-.5L5 1z" fill={C.a}/>
            </svg>
          ))}
        </div>

        {/* Frase subrayada — el color del lomo hace de marcatextos */}
        {quote && (
          <p className="line-clamp-2 mt-2" style={{ lineHeight: 1.75 }}>
            <span style={{
              fontFamily: "var(--font-lora)",
              fontSize: "12px",
              fontStyle: "italic",
              color: "white",
              background: book.color,
              padding: "2px 6px",
              borderRadius: "4px",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}>
              “{quote.text}”
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
