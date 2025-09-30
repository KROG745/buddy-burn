import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("main.tsx: Starting app");
const root = document.getElementById("root");
console.log("main.tsx: Root element found:", !!root);

if (root) {
  createRoot(root).render(<App />);
  console.log("main.tsx: App rendered");
} else {
  console.error("main.tsx: No root element found!");
}
