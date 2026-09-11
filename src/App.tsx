import { useLayoutEffect, useState } from "react";
import { type ReactNode } from "react";
import OverviewScreen from "./screens/OverviewScreen";
import ShelvesScreen from "./screens/ShelvesScreen";
import LoansScreen from "./screens/LoansScreen";
import AddBookModal from "./components/AddBookModal";
import SettingsScreen from "./screens/SettingsScreen";
import { C } from "./theme";

type Tab = "overview" | "shelves" | "loans";

/* Dimensiones lógicas del dispositivo (iPhone 14) */
const PHONE_W = 390;
const PHONE_H = 844;
/* Aire mínimo alrededor del mockup */
const MARGIN = 32;

/* Escala el mockup para que quepa completo en el viewport disponible */
function usePhoneScale() {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setScale(
        Math.min(
          1,
          (h - MARGIN) / PHONE_H,
          (w - MARGIN) / PHONE_W,
        ),
      );
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, []);

  return scale;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showAddBook, setShowAddBook] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scale = usePhoneScale();

  return (
    /* Shell exterior — color bosque oscuro */
    <div className="size-full flex items-center justify-center overflow-hidden" style={{ background: C.shell }}>
      {/* Contenedor con la huella ya escalada, para que el centrado sea exacto */}
      <div
        className="relative shrink-0"
        style={{ width: PHONE_W * scale, height: PHONE_H * scale }}
      >
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: `${PHONE_W}px`,
          height: `${PHONE_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          background: C.d,           /* 60 % DOMINANTE */
          borderRadius: "44px",
          boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* ── Status bar ─────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-8 pt-4 pb-2 shrink-0"
          style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600, color: C.ink }}
        >
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0"    y="3"  width="3" height="9"  rx="1" fill="currentColor" opacity="0.35"/>
              <rect x="4.5"  y="2"  width="3" height="10" rx="1" fill="currentColor" opacity="0.55"/>
              <rect x="9"    y="0"  width="3" height="12" rx="1" fill="currentColor"/>
              <rect x="13.5" y="0"  width="3" height="12" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" fillOpacity="0"/>
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 2.5C9.8 2.5 11.4 3.3 12.5 4.6L14 3.1C12.5 1.2 10.4 0 8 0C5.6 0 3.5 1.2 2 3.1L3.5 4.6C4.6 3.3 6.2 2.5 8 2.5Z" fill="currentColor"/>
              <path d="M8 5.5C9.1 5.5 10.1 6 10.8 6.8L12.3 5.3C11.2 4.1 9.7 3.3 8 3.3C6.3 3.3 4.8 4.1 3.7 5.3L5.2 6.8C5.9 6 6.9 5.5 8 5.5Z" fill="currentColor" opacity="0.7"/>
              <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.3"/>
              <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor"/>
              <path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill="currentColor" opacity="0.4"/>
            </svg>
          </div>
        </div>

        {/* ── Screen ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "overview" && <OverviewScreen onAddBook={() => setShowAddBook(true)} />}
          {activeTab === "shelves"  && <ShelvesScreen />}
          {activeTab === "loans"    && <LoansScreen />}
        </div>

        {/* ── Bottom nav — 30 % ESTRUCTURA ───────────────────── */}
        {/*
          position + zIndex son necesarios: el contenido de las pantallas usa
          animaciones con transform, que crean contexto de apilamiento y
          taparían la parte del FAB que sobresale por encima de la nav.
        */}
        <div
          className="shrink-0 flex items-end justify-around pb-8 pt-3 px-2"
          style={{
            background: C.s,          /* 30 % */
            borderTop: `1px solid ${C.sDark}`,
            position: "relative",
            zIndex: 20,
          }}
        >
          <NavTab label="Colección" active={activeTab === "overview"} onClick={() => setActiveTab("overview")}
            icon={<IconBooks  active={activeTab === "overview"} />} />
          <NavTab label="Libreros"  active={activeTab === "shelves"}  onClick={() => setActiveTab("shelves")}
            icon={<IconShelf  active={activeTab === "shelves"}  />} />

          {/* FAB — 10 % ACENTO */}
          <button
            onClick={() => setShowAddBook(true)}
            className="flex flex-col items-center gap-1"
            style={{ marginTop: "-22px" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95"
              style={{
                background: C.a,
                boxShadow: `0 6px 20px ${C.aGlow}, 0 2px 6px rgba(0,0,0,0.15)`,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 4v14M4 11h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: "10px", fontWeight: 500, color: C.inkMuted, fontFamily: "var(--font-sans)" }}>
              Añadir
            </span>
          </button>

          <NavTab label="Préstamos" active={activeTab === "loans"} onClick={() => setActiveTab("loans")}
            icon={<IconLoans  active={activeTab === "loans"} />} />
          <NavTab label="Ajustes"   active={false}                onClick={() => setShowSettings(true)}
            icon={<IconGear />} />
        </div>

        {/* ── Overlays ───────────────────────────────────────── */}
        {showAddBook  && <AddBookModal  onClose={() => setShowAddBook(false)} />}
        {showSettings && <SettingsScreen onClose={() => setShowSettings(false)} />}
      </div>
      </div>
    </div>
  );
}

/* ── Nav tab ─────────────────────────────────────────────────── */
function NavTab({ label, active, onClick, icon }: {
  label: string; active: boolean; onClick: () => void; icon: ReactNode;
}) {
  return (
    <button className="flex flex-col items-center gap-1 w-16" onClick={onClick}>
      {icon}
      <span style={{
        fontSize: "9.5px",
        fontWeight: active ? 600 : 400,
        color: active ? C.a : C.inkMuted,
        fontFamily: "var(--font-sans)",
        transition: "color 0.18s",
      }}>
        {label}
      </span>
    </button>
  );
}

/* ── Nav icons ───────────────────────────────────────────────── */
function IconBooks({ active }: { active: boolean }) {
  const fill = active ? C.a : C.inkFaint;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3"  y="4" width="5" height="16" rx="1.5" fill={fill}/>
      <rect x="10" y="4" width="5" height="16" rx="1.5" fill={fill} opacity="0.7"/>
      <rect x="17" y="4" width="4" height="16" rx="1.5" fill={fill} opacity="0.45"/>
    </svg>
  );
}
function IconShelf({ active }: { active: boolean }) {
  const c = active ? C.a : C.inkFaint;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3"  y="3"    width="18" height="2.5" rx="1"   fill={c}/>
      <rect x="3"  y="10.5" width="18" height="2.5" rx="1"   fill={c} opacity="0.75"/>
      <rect x="3"  y="18"   width="18" height="2.5" rx="1"   fill={c} opacity="0.5"/>
      <rect x="6"  y="5.5"  width="2"  height="5"   rx="0.5" fill={c} opacity="0.55"/>
      <rect x="10" y="5.5"  width="2"  height="5"   rx="0.5" fill={c} opacity="0.55"/>
      <rect x="8"  y="13"   width="2"  height="5"   rx="0.5" fill={c} opacity="0.55"/>
      <rect x="13" y="13"   width="2"  height="5"   rx="0.5" fill={c} opacity="0.55"/>
    </svg>
  );
}
function IconLoans({ active }: { active: boolean }) {
  const c = active ? C.a : C.inkFaint;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 7h14M5 12h10M5 17h7" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="18" cy="16" r="4" fill={c}/>
      <path d="M16.5 16l1 1 2-2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconGear() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={C.inkFaint} strokeWidth="1.8"/>
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke={C.inkFaint} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
