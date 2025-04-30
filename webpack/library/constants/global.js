const path = require('path');
 const dirname = process.cwd();
 let parent_dir =  process.cwd().replace(/webpack$/, '');
module.exports = {
    file_path:  path.join(dirname).replace(/webpack$/, ''), 
    hash_file: dirname + '/data/hashes.json',
    tailwind_dir : process.cwd() + '/library/tailwind-components/', 
    parent_dir,
    webpack_dir: parent_dir + 'webpack/',
    dist_dir : parent_dir +  'dist',
    MODE: 'production', 
    hash_php_file: parent_dir + 'utilities/correct_hash.php',
    dynamic_hash: {
        "dynamic": "-wp[fullhash]",
        "non": ""
    }
}

 