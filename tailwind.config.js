const { palette } = require("./src/shared/constants/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
   // NOTE: Update this to include the paths to all files that contain Nativewind classes.
   content: ["./src/**/*.{js,jsx,ts,tsx}"],
   presets: [require("nativewind/preset")],
   theme: {
      extend: {
         colors: {
            "bg-base": palette.ink900,
            "bg-elevated": palette.ink800,
            "bg-surface": palette.ink700,
            "bg-overlay": palette.slate800,
            "bg-muted": palette.ink600,

            // Text
            "text-primary": palette.white,
            "text-secondary": palette.gray300,
            "text-muted": palette.gray400,

            // Accent
            accent: palette.purple500,
            "accent-light": palette.purple400,
            "accent-dark": palette.purple600,

            // Border
            "border-default": palette.slate700,
            "border-muted": palette.slate600,

            // Status
            "status-success": palette.green500,
            "status-error": palette.red500,
            "status-airing": palette.green300,

            // backward compatibility
            primary: palette.ink900,
            secondary: palette.ink700,
            light: {
               100: "#D6C6FF",
               200: "#A8B5DB",
               300: "#9CA4AB",
            },
            dark: {
               100: "#221f3d",
               200: "#0f0d23",
            },
         },
      },
   },
   plugins: [],
};
