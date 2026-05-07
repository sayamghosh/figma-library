const fs = require('fs');
const path = require('path');

function migratePage(source, dest, requiresClient = true) {
  let content = fs.readFileSync(source, 'utf-8');
  
  // 1. Remove Vite/Tanstack specific exports
  content = content.replace(/export const Route = .*?;/s, '');
  content = content.replace(/import { createFileRoute.*? } from "@tanstack\/react-router";/g, '');
  content = content.replace(/import { Link.*? } from "@tanstack\/react-router";/g, 'import Link from "next/link";\nimport { useRouter } from "next/navigation";');
  content = content.replace(/import { useNavigate.*? } from "@tanstack\/react-router";/g, 'import { useRouter } from "next/navigation";');
  
  // 2. Adjust navigation/routing
  content = content.replace(/useNavigate\(\)/g, 'useRouter()');
  content = content.replace(/navigate\(\{.*?to:\s*(["'`].*?["'`]).*?\}\)/gs, 'navigate.push($1)');
  
  // Replace params parsing. Original: const { id } = Route.useParams()
  // NextJS App component signature: export default function Page({ params }: { params: { id: string } })
  // So we will just replace the Component declaration later. Let's just fix the hook:
  content = content.replace(/Route\.useParams\(\)/g, 'React.use(params)');
  
  // 3. Rename generic component and export it as default
  // Actually, let's just make sure there is an "export default function" or we'll inject it.
  
  // If the file exports a named function, change it to default.
  // Example: function AddComponent() ...
  // Will become export default function AddComponent() ...
  
  const functionMatch = content.match(/function\s+(\w+)\s*\(/);
  if (functionMatch) {
     const componentName = functionMatch[1];
     content = content.replace(new RegExp(`function\\s+${componentName}\\s*\\(`), `export default function ${componentName}({ params }: any) {`);
  }
  
  // Next Link replacements
  content = content.replace(/<Link(.*?)to=/g, '<Link$1href=');
  
  // Append use client
  if (requiresClient) {
    content = `"use client";\n` + content;
  }
  
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
}

const basePath = 'C:/Users/Sayam/Desktop/figma';

// components/index.tsx
migratePage(
  path.join(basePath, 'frontend/src/routes/components/index.tsx'),
  path.join(basePath, 'frontend-nextjs/app/components/page.tsx')
);

// add-component.tsx
migratePage(
  path.join(basePath, 'frontend/src/routes/add-component.tsx'),
  path.join(basePath, 'frontend-nextjs/app/add-component/page.tsx')
);

// edit-component.$id.tsx
migratePage(
  path.join(basePath, 'frontend/src/routes/edit-component.$id.tsx'),
  path.join(basePath, 'frontend-nextjs/app/edit-component/[id]/page.tsx')
);

// my-components.tsx
migratePage(
  path.join(basePath, 'frontend/src/routes/my-components.tsx'),
  path.join(basePath, 'frontend-nextjs/app/my-components/page.tsx')
);

console.log("Migration complete.");
