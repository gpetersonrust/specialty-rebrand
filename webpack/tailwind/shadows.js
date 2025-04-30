exports.shadow_utilities = ({ addUtilities }) => {
  addUtilities({
    ".brand-shadow-sm": {
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)",
    },
    ".brand-shadow-md": {
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.10), 0px 2px 6px rgba(0, 0, 0, 0.06)",
    },
    ".brand-shadow-lg": {
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12), 0px 4px 10px rgba(0, 0, 0, 0.08)",
    },
    ".brand-shadow-xl": {
      boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.14), 0px 6px 16px rgba(0, 0, 0, 0.10)",
    },
  });
};
