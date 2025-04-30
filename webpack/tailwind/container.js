exports.container_utilities = ({ addUtilities }) => {
    addUtilities({
        '.site-container': {
            width: '100%',
            maxWidth: '1400px',
            paddingLeft: '1.25rem',
            paddingRight: '1,25rem',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        '.site-container-sm': {
            maxWidth: '1200px',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '100%',
        },
        
    });
}