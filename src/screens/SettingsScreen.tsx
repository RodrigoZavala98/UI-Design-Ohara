import { useState } from "react";
import { books } from "../data";
import YearInBooks from "./YearInBooks";
import { ACCENTS, ACTIVE_ACCENT, C } from "../theme";

type Section = "main" | "year" | "appearance" | "notifications" | "library" | "privacy" | "about";

type Settings = {
  theme: "light" | "sepia" | "dark";
  accentColor: "sage" | "mist" | "lavender" | "warm";
  fontSize: "small" | "medium" | "large";
  compactCards: boolean;
  animationsEnabled: boolean;
  defaultView: "grid" | "list";
  sortBy: "title" | "author" | "year" | "added";
  showPageCount: boolean;
  showRatings: boolean;
  autoMarkRead: boolean;
  loanDurationDays: number;
  reminderDaysBefore: number;
  overdueAlerts: boolean;
  notificationsEnabled: boolean;
  loanReminders: boolean;
  weeklyDigest: boolean;
  newFeaturesAlert: boolean;
  backupEnabled: boolean;
  analyticsEnabled: boolean;
  icloudSync: boolean;
  dateFormat: DateFormat;
  language: Language;
};

type DateFormat = "dmy" | "ymd";
type Language   = "es" | "en";

const dateFormats: Record<DateFormat, { label: string; desc: string }> = {
  dmy: { label: "DD-MM-AAAA", desc: "Día, mes y año" },
  ymd: { label: "AAAA-MM-DD", desc: "Año, mes y día (ISO)" },
};

const languages: Record<Language, { label: string; native: string; flag: string }> = {
  es: { label: "Español", native: "Idioma predeterminado", flag: "🇲🇽" },
  en: { label: "Inglés",  native: "English",               flag: "🇬🇧" },
};

/* Ejemplo con la fecha de hoy para previsualizar el formato */
function sampleDate(fmt: DateFormat) {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, "0");
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const y = String(now.getFullYear());
  return fmt === "dmy" ? `${d}-${m}-${y}` : `${y}-${m}-${d}`;
}

const defaults: Settings = {
  theme: "light", accentColor: ACTIVE_ACCENT, fontSize: "medium",
  compactCards: false, animationsEnabled: true,
  defaultView: "grid", sortBy: "title",
  showPageCount: true, showRatings: true, autoMarkRead: false,
  loanDurationDays: 30, reminderDaysBefore: 3, overdueAlerts: true,
  notificationsEnabled: true, loanReminders: true, weeklyDigest: false, newFeaturesAlert: true,
  backupEnabled: true, analyticsEnabled: false, icloudSync: true,
  dateFormat: "dmy", language: "es",
};

/* El hex viene de theme.ts para que no se desincronice con la apariencia real */
const accents = {
  sage:     { label: "Salvia",  hex: ACCENTS.sage.a,     desc: "Equilibrio natural" },
  mist:     { label: "Neblina", hex: ACCENTS.mist.a,     desc: "Serenidad marina" },
  lavender: { label: "Lavanda", hex: ACCENTS.lavender.a, desc: "Calma introspectiva" },
  warm:     { label: "Ámbar",   hex: ACCENTS.warm.a,     desc: "Calidez acogedora" },
};

export default function SettingsScreen({ onClose }: { onClose: () => void }) {
  const [section, setSection] = useState<Section>("main");
  const [cfg, setCfg] = useState<Settings>(defaults);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setCfg((p) => ({ ...p, [k]: v }));

  if (section === "year") {
    return (
      <Sub title="My year in books" onBack={() => setSection("main")} onClose={onClose}>
        <YearInBooks />
      </Sub>
    );
  }

  if (section !== "main") {
    return (
      <Sub title={meta[section].title} onBack={() => setSection("main")} onClose={onClose}>
        {section === "appearance"    && <Appearance    cfg={cfg} set={set} />}
        {section === "library"       && <Library       cfg={cfg} set={set} />}
        {section === "notifications" && <Notifications cfg={cfg} set={set} />}
        {section === "privacy"       && <Privacy       cfg={cfg} set={set} />}
        {section === "about"         && <About />}
      </Sub>
    );
  }

  return (
    /* 60 % DOMINANTE */
    <div className="absolute inset-0 flex flex-col animate-slide-right" style={{ background: C.d, zIndex: 60 }}>

      {/* Header */}
      <div className="px-6 pt-4 pb-5 shrink-0" style={{ borderBottom: `1px solid ${C.sDark}` }}>
        <div className="flex items-center justify-between mb-1">
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.s }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke={C.inkMid} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: C.inkMuted, fontWeight: 500, letterSpacing: "0.08em" }}>
            CONFIGURACIÓN
          </span>
          <div className="w-9" />
        </div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 700, color: C.ink }}>Ajustes</h1>

        {/* Perfil — 30 % ESTRUCTURA */}
        <div className="flex items-center gap-3 mt-4 p-3.5 rounded-2xl" style={{ background: C.s }}>
          {/* Avatar — 10 % ACENTO */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: C.a }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 700, color: "white" }}>A</span>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: C.ink }}>Ana García</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMuted }}>
              {books.length} libros · {books.filter((b) => b.read).length} leídos
            </p>
          </div>
          <button className="ml-auto" style={{ color: C.a }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Section list — 30 % ESTRUCTURA */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* ── My year in books — destacado, 10 % ACENTO ── */}
        <button
          onClick={() => setSection("year")}
          className="w-full flex items-center gap-3 p-4 rounded-2xl text-left active:scale-98 transition-all animate-fade-in"
          style={{ background: C.aPale, outline: `1.5px solid ${C.a}45` }}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl"
            style={{ background: C.dSoft }}>
            ✨
          </div>
          <div className="flex-1">
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 700, color: C.a }}>
              My year in books
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMid, marginTop: "1px" }}>
              Mi resumen anual de lectura
            </p>
          </div>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke={C.a} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="my-4" style={{ height: "1px", background: C.sDark, opacity: 0.55 }} />

        <div className="flex flex-col gap-2">
          {(Object.keys(meta) as SubSection[]).map((key, i) => {
            const m = meta[key];
            return (
              <button key={key} onClick={() => setSection(key)}
                className="flex items-center gap-3 p-4 rounded-2xl text-left active:scale-98 transition-all animate-fade-in"
                style={{ background: C.s, animationDelay: `${i * 45}ms` }}>
                {/* Icon spot — fondo dominante dentro de estructura */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl" style={{ background: C.d }}>
                  {m.icon}
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 600, color: C.ink }}>{m.title}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: C.inkMuted, marginTop: "1px" }}>{m.sub}</p>
                </div>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.3 }}>
                  <path d="M6 4l4 4-4 4" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            );
          })}
        </div>

        <p style={{ textAlign: "center", marginTop: "28px", fontFamily: "var(--font-lora)", fontSize: "12px", color: C.inkFaint, fontStyle: "italic" }}>
          Ohara v1.0.0 | Por: José Rodrigo López
        </p>
      </div>
    </div>
  );
}

/* ── Sub-screen wrapper ───────────────────────────────────── */
function Sub({ title, onBack, onClose, children }: {
  title: string; onBack: () => void; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 flex flex-col animate-slide-right" style={{ background: C.d, zIndex: 70 }}>
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 shrink-0" style={{ borderBottom: `1px solid ${C.sDark}` }}>
        <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.s }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke={C.inkMid} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 700, color: C.ink, flex: 1 }}>{title}</h2>
        <button onClick={onClose} style={{ color: C.inkMuted }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
    </div>
  );
}

/* ── Apariencia ───────────────────────────────────────────── */
function Appearance({ cfg, set }: { cfg: Settings; set: SetFn }) {
  return (
    <div className="flex flex-col gap-5">
      <Group title="Tema">
        <div className="grid grid-cols-3 gap-2 p-3">
          {(["light","sepia","dark"] as const).map((t) => {
            const labels = { light:"Claro", sepia:"Sépia", dark:"Oscuro" };
            const bgs    = { light: C.d, sepia:"#ede0c8", dark: C.shell };
            const on = cfg.theme === t;
            return (
              <button key={t} onClick={() => set("theme", t)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                style={{ background: on ? C.aPale : C.dDeep, outline: on ? `2px solid ${C.a}` : "none" }}>
                <div className="w-10 h-10 rounded-xl border" style={{ background: bgs[t], borderColor: C.sDark }} />
                <span style={{ fontFamily:"var(--font-sans)", fontSize:"11px", color: on ? C.a : C.inkMid, fontWeight: on ? 600 : 400 }}>
                  {labels[t]}
                </span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Color de acento">
        {/* Nota de psicología */}
        <div className="px-4 pt-3 pb-1">
          <p style={{ fontFamily: "var(--font-lora)", fontSize: "12px", color: C.inkMuted, fontStyle: "italic", lineHeight: 1.5 }}>
            Cada tono usa la fórmula 60-30-10 manteniendo la armonía visual.
          </p>
        </div>
        <div className="flex flex-col gap-1 p-3 pt-2">
          {(Object.entries(accents) as [keyof typeof accents, typeof accents[keyof typeof accents]][]).map(([key, val]) => {
            const on = cfg.accentColor === key;
            return (
              <button key={key} onClick={() => set("accentColor", key)}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{ background: on ? C.aPale : "transparent", outline: on ? `1.5px solid ${C.a}50` : "none" }}>
                <div className="w-8 h-8 rounded-full shrink-0" style={{ background: val.hex }} />
                <div className="flex-1 text-left">
                  <p style={{ fontFamily:"var(--font-sans)", fontSize:"13px", fontWeight:600, color:C.ink }}>{val.label}</p>
                  <p style={{ fontFamily:"var(--font-sans)", fontSize:"11px", color:C.inkMuted }}>{val.desc}</p>
                </div>
                {on && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: C.a }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2.5 5l2 2 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Tamaño de texto">
        <div className="grid grid-cols-3 gap-2 p-3">
          {(["small","medium","large"] as const).map((sz) => {
            const labels = { small:"Pequeño", medium:"Mediano", large:"Grande" };
            const sizes  = { small:"13px", medium:"16px", large:"19px" };
            const on = cfg.fontSize === sz;
            return (
              <button key={sz} onClick={() => set("fontSize", sz)}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl"
                style={{ background: on ? C.aPale : C.dDeep, outline: on ? `2px solid ${C.a}` : "none" }}>
                <span style={{ fontFamily:"var(--font-serif)", fontSize: sizes[sz], fontWeight:600, color: on ? C.a : C.inkMid }}>Aa</span>
                <span style={{ fontFamily:"var(--font-sans)", fontSize:"10px", color: on ? C.a : C.inkMuted }}>{labels[sz]}</span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Formato de fecha">
        <div className="flex flex-col gap-1 p-3">
          {(Object.keys(dateFormats) as DateFormat[]).map((fmt) => {
            const on = cfg.dateFormat === fmt;
            const f  = dateFormats[fmt];
            return (
              <button key={fmt} onClick={() => set("dateFormat", fmt)}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{ background: on ? C.aPale : "transparent", outline: on ? `1.5px solid ${C.a}50` : "none" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: on ? `${C.a}18` : C.dDeep }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <rect x="2.5" y="4" width="15" height="13.5" rx="2.5" stroke={on ? C.a : C.inkMid} strokeWidth="1.5"/>
                    <path d="M2.5 8h15M6.5 2.5v3M13.5 2.5v3" stroke={on ? C.a : C.inkMid} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p style={{ fontFamily:"DM Mono, monospace", fontSize:"13.5px", fontWeight:600, color: on ? C.a : C.ink }}>
                    {f.label}
                  </p>
                  <p style={{ fontFamily:"var(--font-sans)", fontSize:"11px", color:C.inkMuted }}>
                    {f.desc} · hoy sería {sampleDate(fmt)}
                  </p>
                </div>
                {on && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: C.a }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2.5 5l2 2 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Idioma">
        <div className="flex flex-col gap-1 p-3">
          {(Object.keys(languages) as Language[]).map((lang) => {
            const on = cfg.language === lang;
            const l  = languages[lang];
            return (
              <button key={lang} onClick={() => set("language", lang)}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{ background: on ? C.aPale : "transparent", outline: on ? `1.5px solid ${C.a}50` : "none" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: on ? `${C.a}18` : C.dDeep, fontSize: "17px" }}>
                  {l.flag}
                </div>
                <div className="flex-1 text-left">
                  <p style={{ fontFamily:"var(--font-sans)", fontSize:"13px", fontWeight:600, color: on ? C.a : C.ink }}>
                    {l.label}
                  </p>
                  <p style={{ fontFamily:"var(--font-sans)", fontSize:"11px", color:C.inkMuted }}>{l.native}</p>
                </div>
                {on && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: C.a }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2.5 5l2 2 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Opciones">
        <Toggle label="Tarjetas compactas"  desc="Más libros en pantalla"            checked={cfg.compactCards}      onChange={(v) => set("compactCards", v)} />
        <Toggle label="Animaciones"          desc="Transiciones suaves entre vistas"  checked={cfg.animationsEnabled} onChange={(v) => set("animationsEnabled", v)} />
      </Group>
    </div>
  );
}

/* ── Librería ─────────────────────────────────────────────── */
function Library({ cfg, set }: { cfg: Settings; set: SetFn }) {
  return (
    <div className="flex flex-col gap-5">
      <Group title="Vista predeterminada">
        <div className="flex gap-2 p-3">
          {(["grid","list"] as const).map((v) => {
            const labels = { grid:"📱 Cuadrícula", list:"📋 Lista" };
            const on = cfg.defaultView === v;
            return (
              <button key={v} onClick={() => set("defaultView", v)}
                className="flex-1 py-3 rounded-xl font-medium transition-all"
                style={{ background: on ? C.a : C.dDeep, color: on ? "white" : C.inkMid, fontFamily:"var(--font-sans)", fontSize:"13px" }}>
                {labels[v]}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Ordenar por">
        <div className="flex flex-col gap-1 p-3">
          {([["title","Título (A–Z)"],["author","Autor"],["year","Año"],["added","Fecha de añadido"]] as const).map(([val, label]) => {
            const on = cfg.sortBy === val;
            return (
              <button key={val} onClick={() => set("sortBy", val)}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                style={{ background: on ? C.aPale : "transparent" }}>
                <span style={{ fontFamily:"var(--font-sans)", fontSize:"14px", color: on ? C.a : C.inkMid, fontWeight: on ? 500 : 400 }}>
                  {label}
                </span>
                {on && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: C.a }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2.5 5l2 2 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Duración del préstamo">
        <div className="p-4 flex flex-col gap-3">
          <Stepper label="Días estándar"            value={cfg.loanDurationDays}   min={7}  max={90} step={7} onChange={(v) => set("loanDurationDays", v)} unit="d" />
          <Stepper label="Recordar antes de vencer" value={cfg.reminderDaysBefore} min={1}  max={14} step={1} onChange={(v) => set("reminderDaysBefore", v)} unit="d" />
        </div>
      </Group>

      <Group title="Visualización">
        <Toggle label="Número de páginas"           desc="En tarjetas y detalle"           checked={cfg.showPageCount}  onChange={(v) => set("showPageCount", v)} />
        <Toggle label="Calificaciones"              desc="Estrellas en la colección"        checked={cfg.showRatings}    onChange={(v) => set("showRatings", v)} />
        <Toggle label="Marcar leído automáticamente" desc="Al vencer el período estimado"  checked={cfg.autoMarkRead}   onChange={(v) => set("autoMarkRead", v)} />
      </Group>
    </div>
  );
}

/* ── Notificaciones ───────────────────────────────────────── */
function Notifications({ cfg, set }: { cfg: Settings; set: SetFn }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: C.s }}>
        <span style={{ fontSize: "20px" }}>🔔</span>
        <p style={{ fontFamily:"var(--font-lora)", fontSize:"13px", color:C.inkMid, fontStyle:"italic", lineHeight:1.5 }}>
          Los recordatorios mantienen tu colección al día sin esfuerzo.
        </p>
      </div>
      <Group title="General">
        <Toggle label="Activar notificaciones" desc="Habilitar todas las alertas" checked={cfg.notificationsEnabled} onChange={(v) => set("notificationsEnabled", v)} big />
      </Group>
      {cfg.notificationsEnabled && (
        <Group title="Tipos de aviso">
          <Toggle label="Recordatorios de préstamos" desc="Aviso antes de la devolución"       checked={cfg.loanReminders}    onChange={(v) => set("loanReminders", v)} />
          <Toggle label="Alertas de vencimiento"     desc="Libros que superaron el límite"     checked={cfg.overdueAlerts}    onChange={(v) => set("overdueAlerts", v)} />
          <Toggle label="Resumen semanal"            desc="Un vistazo a tu lectura cada domingo" checked={cfg.weeklyDigest}   onChange={(v) => set("weeklyDigest", v)} />
          <Toggle label="Novedades de la app"        desc="Nuevas funciones y mejoras"          checked={cfg.newFeaturesAlert} onChange={(v) => set("newFeaturesAlert", v)} />
        </Group>
      )}
    </div>
  );
}

/* ── Privacidad ───────────────────────────────────────────── */
function Privacy({ cfg, set }: { cfg: Settings; set: SetFn }) {
  return (
    <div className="flex flex-col gap-5">
      <Group title="Sincronización">
        <Toggle label="Respaldo automático"    desc="Guarda tu colección en la nube"            checked={cfg.backupEnabled} onChange={(v) => set("backupEnabled", v)} />
        <Toggle label="Sincronizar con iCloud" desc="Accede en todos tus dispositivos"          checked={cfg.icloudSync}    onChange={(v) => set("icloudSync", v)} />
      </Group>
      <Group title="Datos y privacidad">
        <Toggle label="Análisis de uso" desc="Ayuda a mejorar la app (anónimo)" checked={cfg.analyticsEnabled} onChange={(v) => set("analyticsEnabled", v)} />
      </Group>
      <Group title="Gestión de datos">
        <Action label="Exportar colección" desc="CSV o JSON" icon="📤" />
        <Action label="Importar libros"    desc="Desde Goodreads u otro formato" icon="📥" />
        <Action label="Borrar todos los datos" desc="Elimina permanentemente" icon="🗑️" danger />
      </Group>
    </div>
  );
}

/* ── About ────────────────────────────────────────────────── */
function About() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center py-6 gap-3">
        {/* Logo — 10 % ACENTO */}
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: C.a, boxShadow: `0 8px 24px ${C.aGlow}` }}>
          <span style={{ fontSize: "36px" }}>📚</span>
        </div>
        <div className="text-center">
          <p style={{ fontFamily:"var(--font-serif)", fontSize:"22px", fontWeight:700, color:C.ink }}>Ohara</p>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"13px", color:C.inkMuted, marginTop:"2px" }}>Versión 1.0.0 (42)</p>
        </div>
      </div>
      <Group title="Aplicación">
        <Action label="Valorar la app"       desc="Tu opinión nos ayuda" icon="⭐" />
        <Action label="Compartir con amigos" desc="Recomienda Bibliotheca" icon="📣" />
        <Action label="Centro de ayuda"      desc="Guías y preguntas frecuentes" icon="💬" />
      </Group>
      <Group title="Legal">
        <Action label="Política de privacidad" desc="Cómo usamos tus datos" icon="🔒" />
        <Action label="Términos de uso"        desc="Condiciones del servicio" icon="📄" />
      </Group>
      <p style={{ textAlign:"center", fontFamily:"var(--font-lora)", fontSize:"12px", color:C.inkFaint, fontStyle:"italic", marginTop:"8px" }}>
        Hecho con calma y cuidado 🌿
      </p>
    </div>
  );
}

/* ── Primitivos compartidos ───────────────────────────────── */

/* Group — 30 % ESTRUCTURA */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:"11px", fontWeight:600, color:C.inkMuted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"8px" }}>
        {title}
      </p>
      <div className="rounded-2xl overflow-hidden" style={{ background: C.s }}>
        {children}
      </div>
    </div>
  );
}

/* Toggle — thumb blanco sobre fondo acento 10 % */
function Toggle({ label, desc, checked, onChange, big }: {
  label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; big?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${C.sDark}` }}>
      <div className="flex-1">
        <p style={{ fontFamily:"var(--font-sans)", fontSize: big ? "15px" : "14px", fontWeight: big ? 600 : 400, color:C.ink }}>{label}</p>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:"11px", color:C.inkMuted, marginTop:"1px" }}>{desc}</p>
      </div>
      <button onClick={() => onChange(!checked)} className="shrink-0 transition-all"
        style={{
          width:"44px", height:"26px", borderRadius:"13px",
          background: checked ? C.a : C.dDeep,    /* 10 % vs variante dominante */
          position:"relative",
          boxShadow: checked ? `0 2px 8px ${C.aGlow}` : "none",
          transition:"background 0.22s, box-shadow 0.22s",
        }}>
        <div style={{
          position:"absolute", top:"3px",
          left: checked ? "21px" : "3px",
          width:"20px", height:"20px", borderRadius:"50%",
          background:"white",
          boxShadow:"0 1px 4px rgba(0,0,0,0.18)",
          transition:"left 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }} />
      </button>
    </div>
  );
}

/* Stepper */
function Stepper({ label, value, min, max, step, onChange, unit }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; unit: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontFamily:"var(--font-sans)", fontSize:"14px", color:C.inkMid }}>{label}</span>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(min, value - step))}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: C.dDeep, color:C.inkMid, fontSize:"18px", lineHeight:1 }}>−</button>
        <span style={{ fontFamily:"var(--font-serif)", fontSize:"18px", fontWeight:700, color:C.ink, minWidth:"40px", textAlign:"center" }}>
          {value}{unit}
        </span>
        <button onClick={() => onChange(Math.min(max, value + step))}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: C.dDeep, color:C.inkMid, fontSize:"18px", lineHeight:1 }}>+</button>
      </div>
    </div>
  );
}

/* Action row */
function Action({ label, desc, icon, danger }: { label: string; desc: string; icon: string; danger?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${C.sDark}`, cursor:"pointer" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.dDeep, fontSize:"16px" }}>
        {icon}
      </div>
      <div className="flex-1">
        <p style={{ fontFamily:"var(--font-sans)", fontSize:"14px", color: danger ? C.err : C.ink }}>{label}</p>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:"11px", color:C.inkMuted, marginTop:"1px" }}>{desc}</p>
      </div>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ opacity:0.3 }}>
        <path d="M5 3l4 4-4 4" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

/* Secciones que se listan en el menú (year se muestra aparte, destacada) */
type SubSection = Exclude<Section, "main" | "year">;

/* Section metadata */
const meta: Record<SubSection, { title:string; sub:string; icon:string }> = {
  appearance:    { title:"Apariencia",     sub:"Tema, colores y tipografía",         icon:"🎨" },
  library:       { title:"Librería",       sub:"Vistas, orden y préstamos",          icon:"📚" },
  notifications: { title:"Notificaciones", sub:"Alertas y recordatorios",            icon:"🔔" },
  privacy:       { title:"Privacidad",     sub:"Datos, respaldo y sincronización",   icon:"🔒" },
  about:         { title:"Acerca de",      sub:"Versión, ayuda y valoración",        icon:"ℹ️"  },
};

type SetFn = <K extends keyof Settings>(k: K, v: Settings[K]) => void;
