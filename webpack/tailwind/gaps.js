const { breakpoints } = require("./breakpoints");

const gap_values ={
    "site-gap-2x": {
      "desktop": "40px",
      "small-desktop": "32px",
      "tablet": "24px",
      "mobile": "16px"
    },
    "site-gap-lg": {
      "desktop": "24px",
      "small-desktop": "20px",
      "tablet": "18px",
      "mobile": "14px"
    },
    "site-gap-standard": {
      "desktop": "20px",
      "small-desktop": "16px",
      "tablet": "12px",
      "mobile": "10px"
    }
  }

exports.gap_utilities = ( {addUtilities}) => {
    //   minwidth to create classes
    const gapUtilities = Object.entries(gap_values).reduce((acc, [key, value]) => {
        const minWidth = Object.entries(breakpoints).reduce((acc, [breakpoint, size]) => {
            let breakPointValue = value[breakpoint];
            if(!breakPointValue)  return acc;
            acc[`@media (min-width: ${size})`] = { [`--${key}`]: breakPointValue };
            return acc;
        }, {});
        acc[`.${key}`] = minWidth;
        return acc;
    }, {});

 
    
    
    addUtilities(gapUtilities);
}




