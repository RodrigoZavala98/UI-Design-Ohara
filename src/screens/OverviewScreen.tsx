import { useState } from "react";
import { books, shelves } from "../data";
import BookDetailModal from "../components/BookDetailModal";
import type { Book } from "../data";
import { C } from "../theme";

export default function OverviewScreen({ onAddBook }: { onAddBook: () => void }) {
  const [filter, setFilter] = useState("Todos");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Book | null>(null);
  const [search, setSearch] = useState("");

  const categories = ["Todos", ...shelves.map((s) => s.name)];
  const readCount = books.filter((b) => b.read).length;

  const filtered = books.filter((b) => {
    const matchCat = filter === "Todos" || b.genre === filter;
    const matchQ = b.title.toLowerCase().includes(search.toLowerCase()) ||
                   b.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    /* 60 % DOMINANTE como fondo de pantalla */
    <div className="flex flex-col h-full overflow-hidden" style={{ background: C.d }}>

      {/* ── Header ── sobre fondo dominante */}
      <div className="px-6 pt-2 pb-3">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: C.inkMuted, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Mi biblioteca
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>
              Colección
            </h1>
          </div>
          <button
            onClick={() => setView(view === "grid" ? "list" : "grid")}
            className="w-9 h-9 rounded-xl flex items-center justify-center mt-1"
            style={{ background: C.s }}   /* 30 % */
          >
            {view === "grid" ? (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill={C.inkMid}/>
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill={C.inkMid}/>
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill={C.inkMid}/>
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill={C.inkMid}/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="2"    width="14" height="2.5" rx="1" fill={C.inkMid}/>
                <rect x="1" y="6.75" width="14" height="2.5" rx="1" fill={C.inkMid}/>
                <rect x="1" y="11.5" width="14" height="2.5" rx="1" fill={C.inkMid}/>
              </svg>
            )}
          </button>
        </div>

        {/* Stats — 30 % ESTRUCTURA */}
        <div className="flex gap-2.5 mb-4">
          <Stat label="Total"    value={books.length}              active />
          <Stat label="Leídos"   value={readCount} />
          <Stat label="Por leer" value={books.length - readCount} />
        </div>

        {/* Search — 30 % */}
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl mb-3"
          style={{ background: C.s }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke={C.inkMuted} strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke={C.inkMuted} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar título o autor…"
            className="flex-1 bg-transparent outline-none"
            style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: C.ink }}
          />
        </div>

        {/* Category pills — inactivo 30 %, activo 10 % */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs transition-all"
              style={{
                fontFamily: "var(--font-sans)",
                background: filter === cat ? C.a : C.s,   /* 10 % vs 30 % */
                color:      filter === cat ? "white" : C.inkMid,
                fontWeight: filter === cat ? 600 : 400,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Book list ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {view === "grid" ? (
          <div className="grid grid-cols-3 gap-3">
            {filtered.map((book, i) => (
              <button
                key={book.id}
                onClick={() => setSelected(book)}
                className="flex flex-col animate-fade-in"
                style={{ animationDelay: `${i * 35}ms` }}
              >
                <div
                  className="w-full rounded-2xl overflow-hidden mb-1.5"
                  style={{ aspectRatio: "2/3", background: book.color, boxShadow: `0 4px 12px ${book.color}50` }}
                >
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "11px", fontWeight: 600, color: C.ink, lineHeight: 1.3 }} className="line-clamp-2">
                  {book.title}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: C.inkMuted }} className="line-clamp-1 mt-0.5">
                  {book.author}
                </p>
                <div className="flex items-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="8" height="8" viewBox="0 0 10 10">
                      <path d="M5 1l1.2 2.5L9 4l-2 1.9.5 2.6L5 7.3 2.5 8.5 3 5.9 1 4l2.8-.5L5 1z"
                        fill={j < book.rating ? C.a : `${C.sDark}`}/>
                    </svg>
                  ))}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((book, i) => (
              <button
                key={book.id}
                onClick={() => setSelected(book)}
                className="flex items-center gap-3 p-3 rounded-2xl animate-fade-in text-left transition-all"
                style={{
                  background: C.s,     /* 30 % */
                  animationDelay: `${i * 35}ms`,
                }}
              >
                <div className="shrink-0 rounded-xl overflow-hidden" style={{ width: "48px", height: "68px", background: book.color, boxShadow: `0 3px 8px ${book.color}40` }}>
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: 600, color: C.ink }}>{book.title}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMuted }}>{book.author} · {book.year}</p>
                  <div className="flex gap-2 mt-1.5">
                    <Chip>{book.genre}</Chip>
                    {book.read && <Chip accent>Leído</Chip>}
                  </div>
                </div>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.3 }}>
                  <path d="M6 4l4 4-4 4" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && <BookDetailModal book={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function Stat({ label, value, active }: { label: string; value: number; active?: boolean }) {
  return (
    <div className="flex-1 flex flex-col items-center py-2.5 rounded-2xl"
      style={{ background: active ? C.aPale : C.s }}>   {/* 10 % pale vs 30 % */}
      <span style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 700, color: active ? C.a : C.inkMid }}>
        {value}
      </span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: C.inkMuted, fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}

function Chip({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span className="px-2 py-0.5 rounded-full"
      style={{
        background: accent ? C.aPale : C.dDeep,
        color:      accent ? C.a     : C.inkMid,
        fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: accent ? 500 : 400,
      }}>
      {children}
    </span>
  );
}
