exports.spacing_utilities = ({ addUtilities }) => {
  const spacingValues = {
    0: "0",
    1: "clamp(2px, 0.5vw, 4px)",
    2: "clamp(4px, 1vw, 8px)",
    half: "clamp(5px, 1vw, 10px)",
    3: "clamp(6px, 1.25vw, 12px)",
    4: "clamp(8px, 1.5vw, 16px)",
    standard: "clamp(10px, 2vw, 20px)",
    6: "clamp(12px, 2.5vw, 24px)",
    8: "clamp(16px, 3vw, 32px)",
    double: "clamp(20px, 3.5vw, 40px)",
    12: "clamp(24px, 4vw, 48px)",
    16: "clamp(32px, 5vw, 64px)",
  };

  let utilities = {};

  // Generate margin, padding, spacing utilities
  Object.entries(spacingValues).forEach(([key, value]) => {
    utilities[`.brand-margin-${key}`] = { margin: value };
    utilities[`.brand-padding-${key}`] = { padding: value };
    utilities[`.brand-spacing-${key}`] = { padding: value, margin: value };

    // Singular Margin Utilities
    utilities[`.brand-margin-top-${key}`] = { marginTop: value };
    utilities[`.brand-margin-bottom-${key}`] = { marginBottom: value };
    utilities[`.brand-margin-left-${key}`] = { marginLeft: value };
    utilities[`.brand-margin-right-${key}`] = { marginRight: value };

    // x and y
    utilities[`.brand-margin-x-${key}`] = { marginLeft: value, marginRight: value };
    utilities[`.brand-margin-y-${key}`] = { marginTop: value, marginBottom: value };

    // Singular Padding Utilities
    utilities[`.brand-padding-top-${key}`] = { paddingTop: value };
    utilities[`.brand-padding-bottom-${key}`] = { paddingBottom: value };
    utilities[`.brand-padding-left-${key}`] = { paddingLeft: value };
    utilities[`.brand-padding-right-${key}`] = { paddingRight: value };

    // x and y 
    utilities[`.brand-padding-x-${key}`] = { paddingLeft: value, paddingRight: value };
    utilities[`.brand-padding-y-${key}`] = { paddingTop: value, paddingBottom: value };
  });

  // Brand Containers
  const containerConfigs = {
    "large": "1440px",
    "standard": "1024px",
    "small": "768px",
  };

  Object.entries(containerConfigs).forEach(([size, maxWidth]) => {
    utilities[`.brand-container-${size}`] = {
      width: "100%",
      maxWidth: maxWidth,
      paddingLeft: "clamp(1.5rem, 4vw, 2.5rem)",
      paddingRight: "clamp(1.5rem, 4vw, 2.5rem)",
      marginLeft: "auto",
      marginRight: "auto",
    };
  });

  // Generate Gap Utilities
  Object.entries(spacingValues).forEach(([key, value]) => {
    utilities[`.brand-gap-${key}`] = { gap: value };
    utilities[`.brand-gap-x-${key}`] = { columnGap: value };
    utilities[`.brand-gap-y-${key}`] = { rowGap: value };
  });

  // Section Padding
  utilities[".brand-section-padding"] = {
    paddingTop: "clamp(2rem, 5vw, 4rem)",
    paddingBottom: "clamp(2rem, 5vw, 4rem)",
  };

  // Responsive Adjustments
  const responsiveUtilities = {
    "@screen md": {
      ".brand-section-padding": {
        paddingTop: "3rem",
        paddingBottom: "3rem",
      },
    },
    "@screen lg": {
      ".brand-section-padding": {
        paddingTop: "4rem",
        paddingBottom: "4rem",
      },
    },
  };

  addUtilities({ ...utilities, ...responsiveUtilities });
};