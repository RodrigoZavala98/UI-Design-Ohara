import type { Book } from "../data";
import { shelves, loans } from "../data";
import { C } from "../theme";

export default function BookDetailModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const shelf = shelves.find((s) => s.id === book.shelfId);
  const loan  = loans.find((l) => l.bookId === book.id && !l.returned);

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

      {/* ── Detalle ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5">

          {/* Status badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: book.read ? C.aPale : C.s, color: book.read ? C.a : C.inkMuted, fontFamily: "var(--font-sans)" }}>
              {book.read ? "✓ Leído" : "◯ Por leer"}
            </span>
            {loan && (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: C.errPale, color: C.err, fontFamily: "var(--font-sans)" }}>
                Prestado a {loan.borrower}
              </span>
            )}
          </div>

          {/* Meta grid — 30 % ESTRUCTURA */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {[["Año", String(book.year)], ["Páginas", String(book.pages)], ["Género", book.genre]].map(([label, val]) => (
              <div key={label} className="flex flex-col items-center py-3 rounded-2xl" style={{ background: C.s }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: label === "Género" ? "12px" : "18px", fontWeight: 700, color: C.ink }}>
                  {val}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: C.inkMuted, marginTop: "2px" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* ISBN — 30 % */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl mb-5" style={{ background: C.s }}>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.09em" }}>ISBN</p>
              <p style={{ fontFamily: "DM Mono, monospace", fontSize: "13px", color: C.ink, marginTop: "2px" }}>{book.isbn}</p>
            </div>
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <rect x="9"    y="9"  width="2"   height="18" rx="1"   fill={C.inkMid}/>
              <rect x="13"   y="9"  width="1"   height="18" rx="0.5" fill={C.inkMid}/>
              <rect x="15.5" y="9"  width="2"   height="18" rx="1"   fill={C.inkMid}/>
              <rect x="19"   y="9"  width="1"   height="18" rx="0.5" fill={C.inkMid}/>
              <rect x="21.5" y="9"  width="2"   height="18" rx="1"   fill={C.inkMid}/>
            </svg>
          </div>

          {/* Buttons — 10 % ACENTO primario, 30 % secundario */}
          <div className="flex gap-3">
            <button className="flex-1 py-3.5 rounded-2xl font-semibold active:scale-95 transition-all"
              style={{ background: C.a, color: "white", fontFamily: "var(--font-sans)", fontSize: "14px", boxShadow: `0 4px 14px ${C.aGlow}` }}>
              {book.read ? "Releer" : "Marcar leído"}
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
      </div>
    </div>
  );
}
