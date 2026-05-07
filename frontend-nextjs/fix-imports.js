const fs = require('fs');
const path = require('path');

function injectImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      injectImports(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      if (content.includes('useRouter(') && !content.includes('useRouter } from "next/navigation"')) {
        content = content.replace(/(["']use client["'];?\n)/, '$1import { useRouter } from "next/navigation";\n');
      }
      
      if (content.includes('<Link') && !content.includes('Link from "next/link"')) {
        content = content.replace(/(["']use client["'];?\n)/, '$1import Link from "next/link";\n');
        content = content.replace(/^import { useRouter/m, 'import Link from "next/link";\nimport { useRouter'); // fallback
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

injectImports('C:/Users/Sayam/Desktop/figma/frontend-nextjs/app');
