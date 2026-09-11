import { useState } from "react";
import { books, loans as initialLoans } from "../data";
import { C } from "../theme";

export default function LoansScreen() {
  const [loansData, setLoansData] = useState(initialLoans);
  const [tab, setTab] = useState<"active" | "history">("active");

  const active  = loansData.filter((l) => !l.returned);
  const history = loansData.filter((l) =>  l.returned);
  const getBook = (id: string) => books.find((b) => b.id === id);
  const markReturned = (id: string) =>
    setLoansData((p) => p.map((l) => l.id === id ? { ...l, returned: true } : l));

  const isOverdue = (d: string) => new Date(d) < new Date();
  const daysDiff  = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  const overdueN  = active.filter((l) => isOverdue(l.dueDate)).length;
  const displayed = tab === "active" ? active : history;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: C.d }}>

      {/* ── Header ── */}
      <div className="px-6 pt-2 pb-4">
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: C.inkMuted, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Seguimiento
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>
          Préstamos
        </h1>

        {/* Stats — 30 % ESTRUCTURA */}
        <div className="flex gap-2.5 mt-4">
          <StatCard label="En préstamo" value={active.length}  hi />
          <StatCard label="Devueltos"   value={history.length} />
          <StatCard label="Vencidos"    value={overdueN} warn={overdueN > 0} />
        </div>

        {/* Tab switcher — 30 % fondo, 10 % activo */}
        <div className="flex mt-4 rounded-2xl p-1" style={{ background: C.s }}>
          {(["active", "history"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-xl transition-all"
              style={{
                fontFamily: "var(--font-sans)", fontSize: "13px",
                background: tab === t ? C.a : "transparent",
                color:      tab === t ? "white" : C.inkMuted,
                fontWeight: tab === t ? 600 : 400,
              }}>
              {t === "active" ? "Activos" : "Historial"}
            </button>
          ))}
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <span style={{ fontSize: "36px", opacity: 0.4 }}>📖</span>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "15px", color: C.inkMuted, fontStyle: "italic" }}>
              {tab === "active" ? "Sin préstamos activos" : "Sin historial aún"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {displayed.map((loan, i) => {
              const book = getBook(loan.bookId);
              if (!book) return null;
              const overdue = !loan.returned && isOverdue(loan.dueDate);
              const days    = daysDiff(loan.dueDate);

              return (
                /* Tarjeta — 30 % ESTRUCTURA */
                <div key={loan.id} className="rounded-2xl overflow-hidden animate-fade-in"
                  style={{
                    background: C.s,
                    outline: overdue ? `1.5px solid ${C.err}50` : "none",
                    animationDelay: `${i * 50}ms`,
                  }}>

                  <div className="flex items-start gap-3 p-3">
                    <div className="shrink-0 rounded-xl overflow-hidden"
                      style={{ width: "52px", height: "74px", background: book.color, boxShadow: `0 3px 10px ${book.color}45` }}>
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: 600, color: C.ink }}>{book.title}</p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: C.inkMuted, marginTop: "1px" }}>{book.author}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {/* Avatar — 10 % ACENTO */}
                        <div className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: C.a, fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 700, color: "white" }}>
                          {loan.avatar}
                        </div>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: C.inkMid }}>
                          {loan.borrower}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2.5"
                    style={{ borderTop: `1px solid ${C.sDark}` }}>
                    <div>
                      <Row icon="cal">
                        {new Date(loan.lentDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                      </Row>
                      <Row icon="clock" warn={overdue}>
                        {loan.returned ? "Devuelto" :
                          overdue ? `Vencido hace ${Math.abs(days)} días` :
                          days === 0 ? "Vence hoy" : `Vence en ${days} días`}
                      </Row>
                    </div>

                    {/* Action button — 10 % ACENTO */}
                    {!loan.returned ? (
                      <button onClick={() => markReturned(loan.id)}
                        className="px-3 py-1.5 rounded-xl font-semibold active:scale-95 transition-all"
                        style={{ background: C.a, color: "white", fontFamily: "var(--font-sans)", fontSize: "11px" }}>
                        Devuelto ✓
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl"
                        style={{ background: C.aPale, color: C.a, fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 600 }}>
                        ✓ Ok
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Nuevo préstamo — acento 10 % */}
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed mt-3"
          style={{ borderColor: `${C.a}35`, color: C.a }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500 }}>Registrar préstamo</span>
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, hi, warn }: { label: string; value: number; hi?: boolean; warn?: boolean }) {
  const bg    = warn ? C.errPale : hi ? C.aPale : C.s;
  const color = warn ? C.err     : hi ? C.a     : C.inkMid;
  return (
    <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: bg }}>
      <p style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, color }}>{value}</p>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: C.inkMuted }}>{label}</p>
    </div>
  );
}

function Row({ icon, warn, children }: { icon: "cal" | "clock"; warn?: boolean; children: React.ReactNode }) {
  const c = warn ? C.err : C.inkMuted;
  return (
    <div className="flex items-center gap-1.5 mt-0.5">
      {icon === "cal" ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="2" width="10" height="9" rx="1.5" stroke={c} strokeWidth="1.2"/>
          <path d="M1 5h10M4 1v2M8 1v2" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke={c} strokeWidth="1.2"/>
          <path d="M6 3.5V6l1.5 1.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: c, fontWeight: warn ? 600 : 400 }}>
        {children}
      </span>
    </div>
  );
}
