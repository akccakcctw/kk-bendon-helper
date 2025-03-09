import { createRoot } from 'react-dom/client';
import Options from './Options';

const rootElement = document.getElementById('options-root');

if(!rootElement) {
  throw new Error('dom node not found');
}

createRoot(rootElement).render(<Options />);
