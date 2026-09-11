/*
 * Fórmula 60 – 30 – 10
 * ─────────────────────────────────────────────────────────────────
 * 60 %  DOMINANTE  El fondo      — pantallas, lienzos, superficies base
 * 30 %  ESTRUCTURA La estructura — tarjetas, nav, inputs, contenedores
 * 10 %  ACENTO     La acción     — botones, activos, CTAs, badges
 * ─────────────────────────────────────────────────────────────────
 *
 * Cada apariencia define su tríada completa: si solo se cambiara el
 * acento, el 60 % y el 30 % seguirían en la familia anterior y el
 * conjunto se vería roto. Los tres niveles viajan juntos.
 */

export type AccentName = "sage" | "mist" | "lavender" | "warm";

type Palette = {
  /* 60 % DOMINANTE */
  d: string; dSoft: string; dDeep: string;
  /* 30 % ESTRUCTURA */
  s: string; sLight: string; sDark: string; sDeep: string;
  /* 10 % ACENTO */
  a: string; aLight: string; aPale: string; aGlow: string;
  /* Texto */
  ink: string; inkMid: string; inkMuted: string; inkFaint: string;
  /* Fondo exterior del móvil */
  shell: string;
};

export const APPEARANCES: Record<AccentName, Palette> = {
  /* Salvia — equilibrio natural (marfil · salvia · bosque) */
  sage: {
    d: "#f2ede4", dSoft: "#f8f5f0", dDeep: "#e8e1d5",
    s: "#c5d4ca", sLight: "#dce8e0", sDark: "#a8c0b2", sDeep: "#8aaa96",
    a: "#4e7c5f", aLight: "#6b9678", aPale: "#d2e5da", aGlow: "#4e7c5f40",
    ink: "#2a3830", inkMid: "#4a6055", inkMuted: "#7a9a88", inkFaint: "#adc4b8",
    shell: "#1a2620",
  },

  /* Neblina — serenidad marina (bruma clara · azul niebla · azul profundo) */
  mist: {
    d: "#eef2f7", dSoft: "#f8fafc", dDeep: "#e0e8f1",
    s: "#c4d4e2", sLight: "#dbe7f1", sDark: "#a6bccf", sDeep: "#7f9cb4",
    a: "#5a7fa0", aLight: "#7a9bb8", aPale: "#dbe7f2", aGlow: "#5a7fa040",
    ink: "#23313d", inkMid: "#445a6c", inkMuted: "#7794a9", inkFaint: "#a9c1d2",
    shell: "#17212c",
  },

  /* Lavanda — calma introspectiva (nube lila · malva · violeta) */
  lavender: {
    d: "#f3f0f7", dSoft: "#faf8fc", dDeep: "#e8e2f0",
    s: "#cfc7de", sLight: "#e2dcee", sDark: "#b4a9c9", sDeep: "#9385ad",
    a: "#7a6a9a", aLight: "#9789b3", aPale: "#e3ddee", aGlow: "#7a6a9a40",
    ink: "#2e2838", inkMid: "#574d68", inkMuted: "#8d82a3", inkFaint: "#b9b0c9",
    shell: "#221d2e",
  },

  /* Ámbar — calidez acogedora (arena · trigo · tierra tostada) */
  warm: {
    d: "#f7f1e8", dSoft: "#fcf9f4", dDeep: "#eee3d4",
    s: "#ddcdb4", sLight: "#ebe0cd", sDark: "#c9b393", sDeep: "#ab9271",
    a: "#8a6840", aLight: "#a5865f", aPale: "#eee0cf", aGlow: "#8a684040",
    ink: "#3a2e20", inkMid: "#63513c", inkMuted: "#a08d74", inkFaint: "#c6b49a",
    shell: "#2a2119",
  },
};

/* ── Apariencia activa ── cambiar aquí recolorea toda la app ──── */
export const ACTIVE_ACCENT: AccentName = "mist";

const p = APPEARANCES[ACTIVE_ACCENT];

export const C = {
  /* ── 60 % DOMINANTE ── el fondo ───────────────────────────── */
  d:         p.d,        /* fondo principal */
  dSoft:     p.dSoft,    /* variante muy clara (modal interior) */
  dDeep:     p.dDeep,    /* variante más profunda (secciones internas) */

  /* ── 30 % ESTRUCTURA ── la estructura ─────────────────────── */
  s:         p.s,        /* tarjetas, nav bar, inputs, contenedores */
  sLight:    p.sLight,   /* hover / focus suave */
  sDark:     p.sDark,    /* bordes, dividers, separadores */
  sDeep:     p.sDeep,    /* texto sobre fondo estructural, labels */

  /* ── 10 % ACENTO ── la acción ─────────────────────────────── */
  a:         p.a,        /* botón primario, tab activo, badge */
  aLight:    p.aLight,   /* hover del acento */
  aPale:     p.aPale,    /* fondo de chip activo / badge suave */
  aGlow:     p.aGlow,    /* sombra de botones accent */

  /* ── Texto ─────────────────────────────────────────────────── */
  ink:       p.ink,      /* texto principal */
  inkMid:    p.inkMid,   /* texto secundario */
  inkMuted:  p.inkMuted, /* placeholder, captions */
  inkFaint:  p.inkFaint, /* iconos inactivos */

  /* ── Fondo exterior del móvil ──────────────────────────────── */
  shell:     p.shell,

  /* ── Alertas (uso mínimo, fuera de la tríada) ──────────────── */
  warn:      "#c07858",
  warnPale:  "#f5e8e0",
  ok:        p.a,
  okPale:    p.aPale,
  err:       "#a05050",
  errPale:   "#f0dada",
};

/* Compatibilidad con el nombre anterior del mapa de acentos */
export const ACCENTS = APPEARANCES;

/* backward-compat alias — satisfies any stale `import { T }` reference */
export const T = C;
