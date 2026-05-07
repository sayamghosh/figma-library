const fs = require('fs');
const path = require('path');

function resolveImports(dir, depth) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      resolveImports(fullPath, depth + 1);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      const dots = Array(depth).fill('..').join('/');
      
      // We know `api/`, `lib/`, `context/`, `components/` are at the root Next.js folder, so the path from `app/` is `../`
      content = content.replace(/["']\.\.\/(api|lib|context|components|assets)\/([^"']+)["']/g, `"${dots}/$1/$2"`);
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

resolveImports('C:/Users/Sayam/Desktop/figma/frontend-nextjs/app', 1);
