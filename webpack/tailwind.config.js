const path = require("path");
const { file_path } = require("./library/constants/global");
const fg = require('fast-glob');
 
const { safe_list } = require("./tailwind/options");
const { typography_utilities } = require("./tailwind/typography");
const { spacing_utilities } = require("./tailwind/spacing");
const { shadow_utilities } = require("./tailwind/shadows");
const { button_utilities } = require("./tailwind/buttons");
const { form_utilities } = require("./tailwind/form");
const { navbar_utilities } = require("./tailwind/components/navabar");
const { default: talwindGlobals } = require("./tailwind/tailwind-globals");
 

const phpFilesPattern = "**/*.php"; // The glob pattern to find PHP files recursively
 

 
module.exports = {
  mode: "jit",
  darkMode: "class", // ✅ Enables dark mode

  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ React components
    '../**/*.php', // ✅ Add all PHP files
  ],
  safelist: [
    'brand-button',
    'brand-button-primary',
    'brand-button-white'
  ],

  theme: {
    extend: {
      colors: {
        brand:  talwindGlobals.colors,
      },
      borderRadius: {
       
          ['brand-sm']: "4px",
           ['brand-md']: "8px",
          ['brand-lg']: "16px",
          ['brand-xl']: "24px",
          ['brand-2xl']: "32px",
           ['brand-global']: "4px", // ✅ Global Border Radius for Buttons
        
      },

      fontFamily: {
        header: ["Merriweather", "serif"],
        body: ["Open Sans", "sans-serif"],
      },

      spacing: {
        4: "4px",
        8: "8px",
        16: "16px",
        24: "24px",
        32: "32px",
        40: "40px",
        48: "48px",
        56: "56px",
        64: "64px",
      },

      maxWidth: {
        mobile: "100%",
        tablet: "720px",
        desktop: "1024px",
        large: "1280px",
      },

      screens: {
        sm: "640px", // Mobile
        md: "768px", // Tablet
        lg: "1024px", // Small desktop
        xl: "1280px", // Large desktop
        "2xl": "1536px", // Extra large screens
      },

      gap: {
        4: "4px",
        8: "8px",
        16: "16px",
        24: "24px",
        32: "32px",
        40: "40px",
      },

      flex: {
        "1": "1 1 0%",
        "auto": "1 1 auto",
        "none": "none",
      },

      gridTemplateColumns: {
        2: "repeat(2, minmax(0, 1fr))",
        3: "repeat(3, minmax(0, 1fr))",
        4: "repeat(4, minmax(0, 1fr))",
        6: "repeat(6, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
      },

      boxShadow: {
        "brand-low": `
          0.3px 0.5px 0.6px rgba(0, 0, 0, 0.05),
          0.4px 0.8px 1px -1.4px rgba(0, 0, 0, 0.04),
          1px 2.1px 2.5px -2.7px rgba(0, 0, 0, 0.03)
        `,
        "brand-lower-medium": `
          0.3px 0.5px 0.6px rgba(0, 0, 0, 0.07),
          0.6px 1.2px 1.4px -1.2px rgba(0, 0, 0, 0.06),
          1.6px 3.2px 3.9px -2.2px rgba(0, 0, 0, 0.05)
        `,
        "brand-medium": `
          0.3px 0.5px 0.6px rgba(0, 0, 0, 0.1),
          0.8px 1.6px 1.9px -0.9px rgba(0, 0, 0, 0.08),
          2.1px 4.1px 5px -1.8px rgba(0, 0, 0, 0.07),
          5.1px 10.3px 12.5px -2.7px rgba(0, 0, 0, 0.06)
        `,
        "brand-upper-medium": `
          0.3px 0.5px 0.6px rgba(0, 0, 0, 0.12),
          1.2px 2.4px 2.9px -0.7px rgba(0, 0, 0, 0.1),
          2.8px 5.7px 7px -1.3px rgba(0, 0, 0, 0.09),
          4.9px 9.9px 12px -2px rgba(0, 0, 0, 0.08),
          8px 16px 19.6px -2.6px rgba(0, 0, 0, 0.07)
        `,
        "brand-high": `
          0.3px 0.5px 0.6px rgba(0, 0, 0, 0.14),
          1.6px 3.2px 3.9px -0.5px rgba(0, 0, 0, 0.12),
          3.2px 6.3px 7.7px -0.9px rgba(0, 0, 0, 0.11),
          5.7px 11.4px 13.9px -1.4px rgba(0, 0, 0, 0.1),
          9.9px 19.8px 24.1px -1.8px rgba(0, 0, 0, 0.09),
          16.5px 33px 40.1px -2.3px rgba(0, 0, 0, 0.08),
          26.3px 52.5px 63.9px -2.7px rgba(0, 0, 0, 0.07)
        `,
      },

       
    },
  },

  plugins: [
    // form_utilities,
    // spacing_utilities,
    // shadow_utilities, 
    // button_utilities,
    // typography_utilities, 
    // navbar_utilities
  ],
};