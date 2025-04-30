// Import the fs module
const fs = require('fs');
const path = require('path');

// Define a function to replace the content of a file
function replace_file_content(hash_php_file, old_content, new_content) {
  // Read the contents of the file
  fs.readFile(hash_php_file, 'utf8', (err, fileContent) => {
    if (err) throw err;
    // Replace the old content with the new content
    const newFileContent = fileContent.replaceAll(old_content, new_content);
    // Write the modified content back to the file
    fs.writeFile(hash_php_file, newFileContent, (err) => {
      if (err) throw err;
      console.log('File updated successfully');
    });
  });
}


export default replace_file_content;