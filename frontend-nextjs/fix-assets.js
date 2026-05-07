const fs = require('fs');
const path = require('path');
function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      const original = content;
      // replace asset imports
      content = content.replace(/import\s+(\w+)\s+from\s+["']\.\.\/?assets\/(.*?)["']/g, 'const $1 = "/$2";');
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}
processDir('C:/Users/Sayam/Desktop/figma/frontend-nextjs/components');
processDir('C:/Users/Sayam/Desktop/figma/frontend-nextjs/app');
