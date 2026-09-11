/*
 * Fórmula 60 – 30 – 10
 * ─────────────────────────────────────────────────────────────────
 * 60 %  DOMINANTE  Marfil cálido   — fondos, pantallas, lienzos
 * 30 %  ESTRUCTURA Salvia suave    — tarjetas, nav, inputs, contenedores
 * 10 %  ACENTO     Verde bosque    — botones, activos, CTAs, badges
 * ─────────────────────────────────────────────────────────────────
 *
 * Psicología:
 *   Marfil   → descanso visual, apertura mental, no fatiga
 *   Salvia   → equilibrio, naturaleza, pertenencia
 *   Bosque   → crecimiento, acción clara sin agresividad
 */

export const C = {
  /* ── 60 % DOMINANTE ── marfil cálido ──────────────────────── */
  d:         "#f2ede4",   /* fondo principal */
  dSoft:     "#f8f5f0",   /* variante muy clara (modal interior) */
  dDeep:     "#e8e1d5",   /* variante más profunda (secciones internas) */

  /* ── 30 % ESTRUCTURA ── salvia suave ──────────────────────── */
  s:         "#c5d4ca",   /* tarjetas, nav bar, inputs, contenedores */
  sLight:    "#dce8e0",   /* hover / focus suave */
  sDark:     "#a8c0b2",   /* bordes, dividers, separadores */
  sDeep:     "#8aaa96",   /* texto sobre fondo estructural, labels */

  /* ── 10 % ACENTO ── verde bosque ──────────────────────────── */
  a:         "#4e7c5f",   /* botón primario, tab activo, badge */
  aLight:    "#6b9678",   /* hover del acento */
  aPale:     "#d2e5da",   /* fondo de chip activo / badge suave */
  aGlow:     "#4e7c5f40", /* sombra de botones accent */

  /* ── Texto ─────────────────────────────────────────────────── */
  ink:       "#2a3830",   /* texto principal — verde oscuro suave */
  inkMid:    "#4a6055",   /* texto secundario */
  inkMuted:  "#7a9a88",   /* placeholder, captions */
  inkFaint:  "#adc4b8",   /* iconos inactivos */

  /* ── Fondo exterior del móvil ──────────────────────────────── */
  shell:     "#1a2620",

  /* ── Alertas (uso mínimo) ──────────────────────────────────── */
  warn:      "#c07858",
  warnPale:  "#f5e8e0",
  ok:        "#4e7c5f",
  okPale:    "#d2e5da",
  err:       "#a05050",
  errPale:   "#f0dada",
};

/* backward-compat alias — satisfies any stale `import { T }` reference */
export const T = C;
