exports.button_utilities = ({ addComponents, theme }) => {
  addComponents({
    /* === Base Button Styles === */
    ".brand-button": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      textTransform: "uppercase",
      borderRadius: theme("borderRadius.brand-global"),
      cursor: "pointer",
      padding: "0.75em 3em", // ✅ Scales with font size
      fontSize: "clamp(14px, 1.2vw, 18px)", // ✅ Responsive font size
      transition: "background-color 0.5s ease-in-out, transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out",
      marginTop: "clamp(0.75rem, 2vw, 1.25rem)",
    },

    /* === Button Sizes === */
    ".brand-button-sm": { fontSize: "clamp(12px, 1vw, 14px)", padding: "0.5em 2em" },
    ".brand-button-standard": { fontSize: "clamp(14px, 1.2vw, 16px)", padding: "0.75em 3em" },
    ".brand-button-lg": { fontSize: "clamp(16px, 1.4vw, 20px)", padding: "1em 4em" },
    ".brand-button-xl": { fontSize: "clamp(18px, 1.6vw, 24px)", padding: "1.25em 5em" },
    ".brand-button-2xl": { fontSize: "clamp(20px, 1.8vw, 28px)", padding: "1.5em 6em" },

    /* === Primary Button === */
    ".brand-button-primary": {
      backgroundColor: theme("colors.brand.primary"),
      color: "white",
      boxShadow: theme("boxShadow.brand-low"),
      "&:hover": {
        backgroundColor: theme("colors.brand.primary-light"),
        transform: "scale(1.05)",
        boxShadow: theme("boxShadow.brand-upper-medium"),
      },
      "&:focus, &:active": {
        outline: "none",
        backgroundColor: theme("colors.brand.primary-light"),
      },
      "&:disabled": {
        backgroundColor: theme("colors.brand.light"),
        color: theme("colors.brand.raven"),
        cursor: "not-allowed",
        opacity: "0.5",
        filter: "grayscale(100%)",
      },
    },

 

    /* === Dark Button (Always Black) === */
    ".brand-button-dark": {
      backgroundColor: theme("colors.brand.dark"),
      color: "white",
      boxShadow: theme("boxShadow.brand-low"),
      "&:hover": {
        backgroundColor: theme("colors.brand.raven"),
        transform: "scale(1.05)",
        boxShadow: theme("boxShadow.brand-upper-medium"),
      },
      "&:focus, &:active": {
        outline: "none",
        backgroundColor: theme("colors.brand.raven"),
      },
      "&:disabled": {
        backgroundColor: theme("colors.brand.raven"),
        color: theme("colors.brand.light-grey"),
        cursor: "not-allowed",
        opacity: "0.5",
        filter: "grayscale(100%)",
      },
    },

    /* === Secondary Button === */
    ".brand-button-secondary": {
      backgroundColor: theme("colors.brand.secondary"),
      color: theme("colors.brand.raven"),
      boxShadow: theme("boxShadow.brand-low"),
      "&:hover": {
        backgroundColor: theme("colors.brand.light-grey"),
        transform: "scale(1.05)",
        boxShadow: theme("boxShadow.brand-upper-medium"),
      },
      "&:focus, &:active": {
        outline: "none",
        backgroundColor: theme("colors.brand.light-grey"),
      },
      "&:disabled": {
        backgroundColor: theme("colors.brand.light"),
        cursor: "not-allowed",
        opacity: "0.5",
        filter: "grayscale(100%)",
      },
    },

    /* === Outline Button === */
    ".brand-button-outline": {
      backgroundColor: "transparent",
      border: `2px solid ${theme("colors.brand.primary")}`,
      color: theme("colors.brand.primary"),
      "&:hover": {
        backgroundColor: theme("colors.brand.primary-light"),
        color: "white",
        transform: "scale(1.05)",
        boxShadow: theme("boxShadow.brand-upper-medium"),
      },
      "&:focus, &:active": {
        outline: "none",
        borderColor: theme("colors.brand.primary-light"),
      },
      "&:disabled": {
        borderColor: theme("colors.brand.light"),
        color: theme("colors.brand.raven"),
        cursor: "not-allowed",
        opacity: "0.5",
        filter: "grayscale(100%)",
      },
    },

    /* === Ghost Button === */
    ".brand-button-ghost": {
      backgroundColor: "transparent",
      color: theme("colors.brand.primary"),
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        transform: "scale(1.05)",
        boxShadow: theme("boxShadow.brand-upper-medium"),
      },
      "&:focus, &:active": {
        outline: "none",
      },
      "&:disabled": {
        color: theme("colors.brand.raven"),
        cursor: "not-allowed",
        opacity: "0.5",
        filter: "grayscale(100%)",
      },
    },

    /* === Destructive (Danger) Button === */
    ".brand-button-danger": {
      backgroundColor: theme("colors.red.600"),
      color: "white",
      boxShadow: theme("boxShadow.brand-low"),
      "&:hover": {
        backgroundColor: theme("colors.red.500"),
        transform: "scale(1.05)",
        boxShadow: theme("boxShadow.brand-upper-medium"),
      },
      "&:focus, &:active": {
        outline: "none",
        backgroundColor: theme("colors.red.500"),
      },
      "&:disabled": {
        backgroundColor: theme("colors.red.300"),
        cursor: "not-allowed",
        opacity: "0.5",
        filter: "grayscale(100%)",
      },
    },

       /** === White Button Alternates to Dark */
  ".brand-button-white": {
    backgroundColor:  '#fff', // ✅ Uses Tailwind's default white
    color: theme("colors.brand.raven"), // ✅ Dark text for contrast
    boxShadow: theme("boxShadow.brand-low"),
    border: `1px solid ${theme("colors.brand.light")}`, // ✅ Optional border for definition
    "&:hover": {
      backgroundColor: theme("colors.brand.light-grey"), // ✅ Subtle hover color
      transform: "scale(1.05)",
      boxShadow: theme("boxShadow.brand-upper-medium"),
    },
    "&:focus, &:active": {
      outline: "none",
      backgroundColor: theme("colors.brand.light-grey"),
    },
    "&:disabled": {
      backgroundColor: theme("colors.brand.light"),
      color: theme("colors.brand.raven"),
      cursor: "not-allowed",
      opacity: "0.5",
      filter: "grayscale(100%)",
    },
  },

    /* === Success Button === */
    ".brand-button-success": {
      backgroundColor: theme("colors.brand.confirm"),
      color: "white",
      boxShadow: theme("boxShadow.brand-low"),
      "&:hover": {
        backgroundColor: theme("colors.green.500"),
        transform: "scale(1.05)",
        boxShadow: theme("boxShadow.brand-upper-medium"),
      },
      "&:focus, &:active": {
        outline: "none",
        backgroundColor: theme("colors.green.500"),
      },
      "&:disabled": {
        backgroundColor: theme("colors.green.300"),
        cursor: "not-allowed",
        opacity: "0.5",
        filter: "grayscale(100%)",
      },
    },
  });
};

