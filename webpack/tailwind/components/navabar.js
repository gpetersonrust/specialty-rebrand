exports.navbar_utilities = ({ addComponents, theme }) => {
    addComponents({
      /* === Navbar Container === */
      ".brand-navbar": {
        "@apply w-full bg-white shadow-brand-medium py-10 px-24": {}, // ✅ Updated shadow to "brand-upper-medium"
      },
  
      /* === Navbar Inner Wrapper === */
      ".brand-navbar-wrapper": {
        "@apply brand-container-large mx-auto flex justify-between items-center": {}, 
      },
  
      /* === Logo === */
      ".brand-navbar-logo": {
        "@apply text-2xl font-bold text-brand-dark": {}, 
        textDecoration: "none",
      },
  
      /* === Navbar Menu (Always Visible) === */
      ".brand-navbar-menu": {
        "@apply flex gap-[16px]": {}, 
      },
  
      /* === Navbar Menu Item === */
      ".brand-navbar-menu-item": {
        "@apply text-brand-raven hover:text-brand-primary transition-colors duration-300": {},
      },
    });
};