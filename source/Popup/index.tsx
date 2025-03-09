import { createRoot } from 'react-dom/client';
import Popup from './Popup';

const rootElement = document.getElementById('popup-root');

if(!rootElement) {
  throw new Error('dom node not found');
}

createRoot(rootElement).render(<Popup />);
