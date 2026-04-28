import { palette } from "./colors";

export const theme = {
   // ─── Backgrounds ──────────────────────────
   bg: {
      base: palette.ink900, // main screen background
      elevated: palette.ink800, // tab bar, cards on base
      surface: palette.ink700, // cards on elevated
      overlay: palette.slate800, // modals, sheets
      muted: palette.ink600, // subtle sections
   },

   // ─── Text ─────────────────────────────────
   text: {
      primary: palette.white, // main content text
      secondary: palette.gray300, // supporting text
      muted: palette.gray400, // placeholders, hints
      disabled: palette.gray500, // disabled states
      inverse: palette.ink900, // text on light backgrounds
   },

   // ─── Accent / Brand ───────────────────────
   accent: {
      DEFAULT: palette.purple500, // primary actions, active states
      light: palette.purple400, // hover, lighter variant
      dark: palette.purple600, // pressed state
   },

   // ─── Border ───────────────────────────────
   border: {
      DEFAULT: palette.slate700,
      muted: palette.slate600,
   },

   // ─── Status colors ────────────────────────
   status: {
      success: palette.green500,
      error: palette.red500,
      warning: palette.yellow400,
      info: palette.blue400,
      airing: palette.green300, // current text-green-300 for airing badge
   },

   // ─── Tab bar ──────────────────────────────
   tab: {
      bg: palette.ink800,
      iconActive: palette.white,
      iconInactive: palette.gray400,
      labelActive: palette.white,
      labelInactive: palette.gray400,
   },

   // ─── Cards ────────────────────────────────
   card: {
      bg: palette.slate800,
      border: palette.slate700,
      muted: "rgba(15, 13, 35, 0.7)", // current bg-slate-900/70
   },
} as const;

export type Theme = typeof theme;
