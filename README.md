# Reddit Comment Analyzer Pro

A modern web application that fetches and analyzes Reddit user comments using AI-powered insights from Google's Gemini models.

## Features

- 🔍 **Reddit Integration**: Fetch comments from any Reddit user
- 🤖 **AI Analysis**: Comprehensive user profiling using Google Gemini AI
- 📊 **Analytics Dashboard**: Visual insights into comment patterns
- 🌙 **Dark Mode**: Beautiful light/dark theme support
- 💾 **Local Storage**: Save and manage analyzed users
- 📱 **Responsive Design**: Works perfectly on all devices

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Reddit API Configuration
REDDIT_CLIENT_ID=your_reddit_client_id_here
REDDIT_CLIENT_SECRET=your_reddit_client_secret_here
REDDIT_USER_AGENT=RedditAnalyzer/1.0

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Getting Reddit API Credentials

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Click "Create App" or "Create Another App"
3. Choose "script" as the app type
4. Fill in the required fields:
   - **Name**: Your app name
   - **Description**: Brief description
   - **About URL**: Your website (can be placeholder)
   - **Redirect URI**: `http://localhost` (for script apps)
5. Copy the **Client ID** (under the app name) and **Client Secret**

### 3. Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 4. Netlify Deployment

#### Option A: Deploy to Netlify (Recommended)

1. Push your code to a GitHub repository
2. Connect your repository to Netlify
3. Set the environment variables in Netlify:
   - Go to Site Settings → Environment Variables
   - Add all the variables from your `.env` file
4. Deploy the site

#### Option B: Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Run the development server:
   ```bash
   netlify dev
   ```

## API Endpoints

### Reddit Fetch Function
- **Endpoint**: `/.netlify/functions/reddit-fetch`
- **Method**: POST
- **Body**: `{ "username": "reddit_username" }`

### Gemini Analysis Function
- **Endpoint**: `/.netlify/functions/gemini-analyze`
- **Method**: POST
- **Body**: 
  ```json
  {
    "username": "reddit_username",
    "prompt": "analysis_prompt",
    "model": "gemini_model_name",
    "commentsData": [...]
  }
  ```

## Available Analysis Types

- **🕵️ Find Dirt**: Investigative analysis for concerning patterns
- **Comprehensive Profile**: Complete user profiling
- **Top Interests**: Primary areas of engagement
- **Core Values**: Belief systems and values
- **Online Persona**: Public image analysis
- **Interaction Patterns**: Communication style analysis
- **Controversial Topics**: Stance on sensitive issues
- **🕵️‍♂️ Religious Sleuth**: Religious/spiritual profiling
- **🚨 Threat Analysis**: Security-focused assessment
- **🤯 Mind Blower**: Personalized quirky insights

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Netlify Functions (Node.js)
- **APIs**: Reddit API (snoowrap), Google Gemini AI
- **Deployment**: Netlify
- **Storage**: Browser localStorage

## Security & Privacy

- All API keys are stored securely in environment variables
- No user data is permanently stored on servers
- Analysis is performed client-side with serverless functions
- Respects Reddit's API rate limits and terms of service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Disclaimer

This tool is for educational and research purposes. Always respect user privacy and Reddit's terms of service. The AI analysis is for informational purposes only and should not be used for harassment or malicious activities.