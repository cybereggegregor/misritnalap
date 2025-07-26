import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const RedditAuthModal = ({ isOpen, onClose }) => {
  const [accessToken, setAccessToken] = useLocalStorage('redditAccessToken', null);
  const [authUrl, setAuthUrl] = useState('');

  const clientId = 'YOUR_REDDIT_CLIENT_ID'; // Replace with your Reddit client ID
  const redirectUri = 'YOUR_REDIRECT_URI'; // Replace with your redirect URI
  const scopes = ['identity', 'read'];
  const redditOauthUrl = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=RANDOM_STRING&redirect_uri=${redirectUri}&duration=permanent&scope=${scopes.join(' ')}`;

  useEffect(() => {
    setAuthUrl(redditOauthUrl);
  }, []);

  const handleAuthCallback = () => {
    // Extract the code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange the code for an access token
      fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${clientId}:YOUR_REDDIT_CLIENT_SECRET}`)}` // Replace with your client secret
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`
      })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          setAccessToken(data.access_token);
          onClose();
        } else {
          console.error('Error exchanging code for access token:', data);
          // Handle the error appropriately
        }
      })
      .catch(error => {
        console.error('Error exchanging code for access token:', error);
      });
    }
  };

  useEffect(() => {
    if (window.location.search.includes('code=')) {
      handleAuthCallback();
    }
  }, []);

  if (!isOpen) return null;

  return (
    

      
        <h2>Authorize with Reddit</h2>
        
          <a href={authUrl}>Authorize</a>
          <button onClick={onClose}>Close</button>
        
      

  );
};

export default RedditAuthModal;