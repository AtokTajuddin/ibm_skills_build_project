// ensure-index.js
const fs = require('fs');
const path = require('path');

// Ensure the frontend/public directory exists
const publicDir = path.join(__dirname, 'frontend', 'public');
if (!fs.existsSync(publicDir)) {
  console.log(`Creating directory: ${publicDir}`);
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy index.html to frontend/public
const sourceIndexPath = path.join(__dirname, 'frontend', 'index.html');
const destIndexPath = path.join(publicDir, 'index.html');

if (fs.existsSync(sourceIndexPath)) {
  fs.copyFileSync(sourceIndexPath, destIndexPath);
  console.log(`Copied index.html to ${destIndexPath}`);
} else {
  // Create index.html if it doesn't exist
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

  fs.writeFileSync(destIndexPath, indexHtml);
  console.log(`Created new index.html at ${destIndexPath}`);
}

console.log('Index.html setup complete!');
