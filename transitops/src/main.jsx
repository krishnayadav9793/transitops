import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from './providers/SocketProvider';

// NOTE: App.jsx renders its own <BrowserRouter>; wrapping it again here
// crashes react-router ("cannot render a Router inside another Router").
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketProvider>
  </StrictMode>,
);

