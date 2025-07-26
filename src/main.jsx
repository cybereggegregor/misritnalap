import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const logVisitor = async () => {
  const visitorData = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  try {
    const response = await fetch('/.netlify/functions/visitor-log', {
      method: 'POST',
      body: JSON.stringify(visitorData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to log visitor data:', response.status);
    }
  } catch (error) {
    console.error('Error logging visitor data:', error);
  }
};

logVisitor();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
