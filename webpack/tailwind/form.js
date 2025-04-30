exports.form_utilities = ({ addComponents, theme }) => {
    addComponents({
      /* === Form Wrapper === */
      ".brand-form": {
        width: "100%",
        maxWidth: "80%",
        margin: "0 auto",
        padding: theme("spacing.8"),
        backgroundColor: "white",
        borderRadius: theme("borderRadius.brand-global"),
        boxShadow: theme("boxShadow.brand-low"),
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
      },
  
      /* === Form Title === */
      ".brand-form-title": {
        fontSize: theme("fontSize.2xl"),
        fontWeight: "700",
        color: theme("colors.brand.raven"),
        marginBottom: theme("spacing.4"),
      
      },
  
      /* === Form Description === */
      ".brand-form-description": {
        fontSize: theme("fontSize.base"),
        color: theme("colors.brand.light"),
        marginBottom: theme("spacing.6"),
 
      },
  
      /* === Form Groups === */
      ".brand-form-group": {
        marginBottom: theme("spacing.6"),
      },
  
      /* === Labels === */
      ".brand-label": {
        display: "block",
        fontWeight: "600",
        color: theme("colors.brand.raven"),
        marginBottom:  "clamp(0.5em, 1vw, .75em)",
      },
  
      /* === Inputs, Textarea, and Select === */
      ".brand-input": {
        width: "100%",
        padding: theme("spacing.3"),
        fontSize: theme("fontSize.base"),
        borderRadius: theme("borderRadius.brand-global"),
        border: `1px solid ${theme("colors.brand.light")}`,
        backgroundColor: "white",
        transition: "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:focus": {
          outline: "none",
          borderColor: theme("colors.brand.primary"),
          boxShadow: theme("boxShadow.brand-lower-medium"),
        },
        "&:disabled": {
          backgroundColor: theme("colors.brand.light-grey"),
          cursor: "not-allowed",
          opacity: "0.5",
        },
      },
  
      /* === Checkboxes & Radio Buttons === */
      ".brand-checkbox-group, .brand-radio-group": {
        display: "flex",
        alignItems: "center",
        gap: theme("spacing.4"),
      },
      ".brand-checkbox, .brand-radio": {
        width: theme("spacing.5"),
        height: theme("spacing.5"),
        appearance: "none",
        border: `2px solid ${theme("colors.brand.raven")}`,
        borderRadius: "4px",
        transition: "all 0.3s ease-in-out",
        "&:checked": {
          backgroundColor: `${theme("colors.brand.dark")} !important`,
          borderColor: `${theme("colors.brand.dark")} !important`,
        },
        "&:disabled": {
          borderColor: theme("colors.brand.light"),
          opacity: "0.5",
          cursor: "not-allowed",
        },
        },
      
  
      /* === Submit Button === */
      ".brand-form-action": {
        marginTop: theme("spacing.6"),
        textAlign: "center",
        },
      
      
    });
  };