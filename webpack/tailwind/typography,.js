exports.typography_utilities = ({ addUtilities, theme }) => {
  addUtilities({
    // Hero Header (Uses Header Font)
    ".brand-hero": {
      fontFamily: theme("fontFamily.header"),
      fontSize: "clamp(2.5rem, 5vw, 4rem)",
      fontWeight: "900",
      lineHeight: "1.125",
      marginBottom: "0.5em",
    },

    // Headings (Use Header Font)
    ".brand-h1": {
      fontFamily: theme("fontFamily.header"),
      fontSize: "clamp(2rem, 4vw, 3rem)",
      fontWeight: "900",
      lineHeight: "1.125",
      marginBottom: "0.5em",
    },
    ".brand-h2": {
      fontFamily: theme("fontFamily.header"),
      fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
      fontWeight: "700",
      lineHeight: "1.25",
      marginBottom: "0.5em",
    },
    ".brand-h3": {
      fontFamily: theme("fontFamily.header"),
      fontSize: "clamp(1.25rem, 3vw, 2rem)",
      fontWeight: "700",
      lineHeight: "1.25",
      marginBottom: "0.5em",
    },
    ".brand-h4": {
      fontFamily: theme("fontFamily.header"),
      fontSize: "clamp(1.125rem, 2.5vw, 1.75rem)",
      fontWeight: "700",
      lineHeight: "1.5",
      marginBottom: "0.5em",
    },

    // Body Text (Uses Body Font)
    ".brand-large-body": {
      fontFamily: theme("fontFamily.body"),
      fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
      fontWeight: "400",
      lineHeight: "1.5",
      marginBottom: "0.75em",
    },
    ".brand-body": {
      fontFamily: theme("fontFamily.body"),
      fontSize: "clamp(1rem, 1.75vw, 1.25rem)",
      fontWeight: "400",
      lineHeight: "1.5",
      marginBottom: "0.75em",
    },
    ".brand-small": {
      fontFamily: theme("fontFamily.body"),
      fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
      fontWeight: "400",
      lineHeight: "1.75",
      marginBottom: "0.75em",
    },

    // Font Weights
    ".brand-font-light": { fontWeight: "300" },
    ".brand-font-regular": { fontWeight: "400" },
    ".brand-font-semibold": { fontWeight: "600" },
    ".brand-font-bold": { fontWeight: "700" },
    ".brand-font-extrabold": { fontWeight: "900" },

    // Brand Color Variants
    ".brand-text-primary": { color: theme("colors.brand.primary") },
    ".brand-text-primary-light": { color: theme("colors.brand.primary-light") },
    ".brand-text-secondary": { color: theme("colors.brand.secondary") },
    ".brand-text-tertiary": { color: theme("colors.brand.tertiary") },
    ".brand-text-confirm": { color: theme("colors.brand.confirm") },
    ".brand-text-raven": { color: theme("colors.brand.raven") },
    ".brand-text-dark": { color: theme("colors.brand.dark") },
    ".brand-text-light-grey": { color: theme("colors.brand.light-grey") },

    // Dark Mode Variants
    ".dark .brand-text-primary": { color: theme("colors.brand.primary-light") },
    ".dark .brand-text-secondary": { color: theme("colors.brand.raven") },
    ".dark .brand-text-tertiary": { color: theme("colors.brand.tertiary") },
    ".dark .brand-text-confirm": { color: theme("colors.brand.confirm") },
    ".dark .brand-text-light-grey": { color: theme("colors.brand.secondary") },
  });
};