const fs = require('fs');
const path = require('path');

function fixFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixFiles(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      content = content.replace(/\) \{\) \{/g, ') {');
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

fixFiles('C:/Users/Sayam/Desktop/figma/frontend-nextjs/app');
