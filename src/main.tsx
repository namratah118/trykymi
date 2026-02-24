import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Ensure <div id="root"></div> exists in index.html');
}

const root = createRoot(rootElement);
root.render(<App />);
