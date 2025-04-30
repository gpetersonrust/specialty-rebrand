#!/bin/bash

# Navigate to Webpack directory (Assuming you're in the root of the project)
WEBPACK_DIR="./tailwind"

# Create the webpack/tailwind directory if it doesn't exist
mkdir -p "$WEBPACK_DIR"

# Function to create files with content
create_file() {
  local file_path="$WEBPACK_DIR/$1"
  local content="$2"
  
  # Write the content to the file
  echo "$content" > "$file_path"
  echo "Created: $file_path"
}

# 📌 Create typography.js
create_file "typography.js" \
"exports.typography_utilities = ({ addUtilities }) => {
  addUtilities({
    \".brand-font-header\": { fontFamily: \"'Merriweather', serif\" },
    \".brand-font-body\": { fontFamily: \"'Open Sans', sans-serif\" },

    \".brand-text-sm\": { fontSize: \"14px\", lineHeight: \"1.4\" },
    \".brand-text-md\": { fontSize: \"16px\", lineHeight: \"1.6\" },
    \".brand-text-lg\": { fontSize: \"20px\", lineHeight: \"1.8\" },
    \".brand-text-xl\": { fontSize: \"24px\", lineHeight: \"1.8\" },
    \".brand-text-2xl\": { fontSize: \"32px\", lineHeight: \"2.0\" },

    \".brand-font-light\": { fontWeight: \"300\" },
    \".brand-font-regular\": { fontWeight: \"400\" },
    \".brand-font-semibold\": { fontWeight: \"600\" },
    \".brand-font-bold\": { fontWeight: \"700\" },
  });
};"

# 📌 Create spacing.js
create_file "spacing.js" \
"exports.spacing_utilities = ({ addUtilities }) => {
  addUtilities({
    \".brand-spacing-xs\": { padding: \"4px\", margin: \"4px\" },
    \".brand-spacing-sm\": { padding: \"8px\", margin: \"8px\" },
    \".brand-spacing-md\": { padding: \"16px\", margin: \"16px\" },
    \".brand-spacing-lg\": { padding: \"24px\", margin: \"24px\" },
    \".brand-spacing-xl\": { padding: \"32px\", margin: \"32px\" },
  });
};"

# 📌 Create buttons.js
create_file "buttons.js" \
"exports.button_utilities = ({ addUtilities }) => {
  addUtilities({
    \".brand-btn\": {
      padding: \"12px 24px\",
      borderRadius: \"var(--brand-radius, 8px)\",
      fontWeight: \"600\",
      transition: \"all 0.3s ease-in-out\",
    },
    \".brand-btn-primary\": {
      backgroundColor: \"var(--brand-primary, #007AFF)\",
      color: \"white\",
      \"&:hover\": { backgroundColor: \"#005ecb\" },
    },
    \".brand-btn-secondary\": {
      backgroundColor: \"var(--brand-secondary, #EFEFF4)\",
      color: \"#333\",
      \"&:hover\": { backgroundColor: \"#d6d6db\" },
    },
  });
};"

# 📌 Create shadows.js
create_file "shadows.js" \
"exports.shadow_utilities = ({ addUtilities }) => {
  addUtilities({
    \".brand-shadow-sm\": {
      boxShadow: \"0px 2px 4px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)\",
    },
    \".brand-shadow-md\": {
      boxShadow: \"0px 4px 12px rgba(0, 0, 0, 0.10), 0px 2px 6px rgba(0, 0, 0, 0.06)\",
    },
    \".brand-shadow-lg\": {
      boxShadow: \"0px 8px 24px rgba(0, 0, 0, 0.12), 0px 4px 10px rgba(0, 0, 0, 0.08)\",
    },
    \".brand-shadow-xl\": {
      boxShadow: \"0px 12px 32px rgba(0, 0, 0, 0.14), 0px 6px 16px rgba(0, 0, 0, 0.10)\",
    },
  });
};"

echo "✅ All Tailwind utility files have been set up in $WEBPACK_DIR"
