// vercel-build.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting Vercel build debug script...');

// Check environment
console.log(`Working directory: ${process.cwd()}`);
console.log(`Node version: ${process.version}`);

// List directories
console.log('\nDirectory structure:');
try {
  const dirs = execSync('find . -type d -not -path "*/node_modules/*" -not -path "*/.git/*" | sort').toString();
  console.log(dirs);
} catch (err) {
  console.log('Error listing directories:', err.message);
}

// Check if frontend/public exists
const publicDir = path.join(process.cwd(), 'frontend', 'public');
console.log(`\nChecking ${publicDir}...`);
if (fs.existsSync(publicDir)) {
  console.log('✅ frontend/public directory exists');
  const files = fs.readdirSync(publicDir);
  console.log(`Files in frontend/public: ${files.join(', ')}`);
  
  // Check if index.html exists
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html exists in frontend/public');
    console.log(`index.html size: ${fs.statSync(indexPath).size} bytes`);
  } else {
    console.log('❌ index.html DOES NOT exist in frontend/public');
    
    // Create it
    try {
      const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Virtual Hospital - Your Health, Anytime, Anywhere" />
    <title>Virtual Hospital</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;

      fs.writeFileSync(indexPath, indexHtml);
      console.log('✅ Created index.html in frontend/public');
    } catch (err) {
      console.log('❌ Error creating index.html:', err.message);
    }
  }
} else {
  console.log('❌ frontend/public directory DOES NOT exist');
  
  // Create it
  try {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('✅ Created frontend/public directory');
    
    // Create index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Virtual Hospital - Your Health, Anytime, Anywhere" />
    <title>Virtual Hospital</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;

    fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);
    console.log('✅ Created index.html in frontend/public');
  } catch (err) {
    console.log('❌ Error creating directory/file:', err.message);
  }
}

console.log('\nContinuing with build...');
