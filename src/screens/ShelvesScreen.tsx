import { useState } from "react";
import { books, shelves } from "../data";
import BookDetailModal from "../components/BookDetailModal";
import type { Book } from "../data";
import { C } from "../theme";

export default function ShelvesScreen() {
  const [openShelf, setOpenShelf] = useState<string | null>(null);
  const [selected, setSelected] = useState<Book | null>(null);
  const shelfBooks = (id: string) => books.filter((b) => b.shelfId === id);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: C.d }}>

      <div className="px-6 pt-2 pb-4">
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: C.inkMuted, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Organización
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>
          Mis libreros
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4">

        {/* ── Ilustración del librero — 30 % ESTRUCTURA ── */}
        <div
          className="rounded-3xl p-5 mb-5 relative overflow-hidden"
          style={{ background: C.s }}
        >
          {/* líneas de estante */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 56px, ${C.sDark} 56px, ${C.sDark} 57px)`,
          }} />
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "11px", color: C.inkMuted, marginBottom: "10px", fontStyle: "italic" }}>
            Vista del librero
          </p>
          <div className="flex flex-col gap-3.5">
            {shelves.slice(0, 3).map((shelf) => {
              const sb = shelfBooks(shelf.id);
              return (
                <div key={shelf.id}>
                  <div className="flex items-end gap-0.5" style={{ height: "44px" }}>
                    {sb.map((book, idx) => (
                      <div key={book.id} className="rounded-sm flex-1"
                        style={{ background: book.color, height: `${28 + (idx % 4) * 7}px`, maxWidth: "26px", minWidth: "11px", opacity: 0.9 }} />
                    ))}
                    {Array.from({ length: Math.max(0, 9 - sb.length) }).map((_, i) => (
                      <div key={i} className="flex-1 rounded-sm"
                        style={{ background: `${C.sDark}40`, height: "16px", maxWidth: "26px", minWidth: "11px" }} />
                    ))}
                  </div>
                  <div style={{ height: "2px", background: C.sDark, borderRadius: "1px", marginTop: "4px" }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Shelf cards ── */}
        <div className="flex flex-col gap-2.5">
          {shelves.map((shelf, idx) => {
            const sb = shelfBooks(shelf.id);
            const isOpen = openShelf === shelf.id;
            return (
              <div key={shelf.id} className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>

                {/* Card — 30 % ESTRUCTURA */}
                <button
                  onClick={() => setOpenShelf(isOpen ? null : shelf.id)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all"
                  style={{
                    background: isOpen ? C.aPale : C.s,      /* activo→ 10 % pale, inactivo→ 30 % */
                    outline: isOpen ? `2px solid ${C.a}50` : "none",
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: isOpen ? `${C.a}18` : C.dDeep }}>
                    {shelf.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 600, color: C.ink }}>{shelf.name}</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: C.inkMuted }}>
                      {sb.length} {sb.length === 1 ? "libro" : "libros"}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {sb.slice(0, 3).map((b) => (
                      <div key={b.id} className="w-6 h-8 rounded-lg overflow-hidden" style={{ background: b.color }}>
                        <img src={b.cover} alt={b.title} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
                    style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", opacity: 0.35 }}>
                    <path d="M6 4l4 4-4 4" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {isOpen && sb.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2 px-1 animate-scale-in">
                    {sb.map((book) => (
                      <button key={book.id} onClick={() => setSelected(book)} className="flex flex-col items-center">
                        <div className="w-full rounded-xl overflow-hidden mb-1"
                          style={{ aspectRatio: "2/3", background: book.color, boxShadow: `0 3px 8px ${book.color}45` }}>
                          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                        </div>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "9px", fontWeight: 600, color: C.ink, textAlign: "center", lineHeight: 1.3 }} className="line-clamp-2">
                          {book.title}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {isOpen && sb.length === 0 && (
                  <div className="mt-2 py-5 flex flex-col items-center gap-1.5">
                    <span style={{ fontSize: "24px", opacity: 0.35 }}>📭</span>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkFaint }}>Estante vacío</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Nuevo librero — acento 10 % en borde y texto */}
          <button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed mt-1"
            style={{ borderColor: `${C.a}35`, color: C.a }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500 }}>Nuevo librero</span>
          </button>
        </div>
      </div>

      {selected && <BookDetailModal book={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
