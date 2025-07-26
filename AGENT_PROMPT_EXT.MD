# Addendum: Detailed Architectural Analysis of PsychScraper

This document provides a comprehensive summary of the 'PsychScraper' application's architecture, based on an analysis of its frontend components, backend serverless functions, and the client-side modules that connect them.

### **Overall Architecture**

The application follows a modern Jamstack architecture, with a decoupled frontend and backend:

*   **Frontend:** A single-page application (SPA) built with **React**, styled with **Tailwind CSS**, and using components from **shadcn/ui**.
*   **Backend:** A set of serverless functions powered by **Node.js** and hosted on **Netlify**, which handle all interactions with external APIs.

### **Frontend Structure: The User Interface**

The UI is built from a series of modular React components found in `src/components`.

*   **Core Workflow Components:** The main user journey is managed by a few key components:
    *   `FetchSection.jsx`: Provides the input form for the user to enter a Reddit username.
    *   `AnalysisSection.jsx`: Allows the user to configure and trigger the analysis after comments are fetched.
    *   `AnalysisResults.jsx` & `AnalyticsSection.jsx`: Display the final analysis returned from the backend.
*   **Supporting Components:** The UI is supported by components for the `Header.jsx`, managing `SavedUsers.jsx`, and a `DownloadSection.jsx`.

### **Backend Logic: Serverless Functions**

All backend operations are handled by two serverless functions in `netlify/functions`, creating a clear separation of concerns.

1.  **Data Collection (`reddit-fetch.js`):**
    *   This function's sole responsibility is to fetch comments for a given Reddit user.
    *   It authenticates with the **Reddit API**, retrieves the comments, and returns them to the frontend.

2.  **Data Analysis (`gemini-analyze.js`):**
    *   This function receives the fetched Reddit comments from the frontend.
    *   It then sends the comments along with a guiding prompt to the **Google Gemini API** for analysis.
    *   The resulting analysis is sent back to the frontend to be displayed to the user.

### **Connecting Frontend and Backend: Services, Hooks, and Utilities**

The bridge between the UI components and the backend functions is built with a clean, modular client-side architecture.

*   **Service Abstraction (`src/services`):**
    *   The `reddit.js` and `gemini.js` services abstract away the `fetch` calls to the Netlify functions. Components don't interact with the backend directly; they call functions from these services, making the code cleaner and easier to maintain.

*   **Stateful Logic (`src/hooks`):**
    *   `useLocalStorage.js` provides a simple way to save data (like previously analyzed users) in the browser.
    *   `useTheme.js` manages the application's light/dark mode, persisting the user's choice.

*   **Reusable Functions (`src/utils`):**
    *   The `reddit.js` utility contains helper functions, such as extracting a username from a full profile URL, which simplifies user input.

### **Workflow Summary**

The entire process, from user input to final output, flows logically through these specialized modules:

1.  A user enters a Reddit profile URL into the `FetchSection.jsx` component.
2.  A utility from `src/utils/reddit.js` cleans the input to get a username.
3.  The `fetchRedditComments` service is called, which triggers the `reddit-fetch` serverless function to get data from the Reddit API.
4.  Once the comments are retrieved, the `analyzeComments` service is called, which triggers the `gemini-analyze` function.
5.  This function sends the data to the Google Gemini API for processing.
6.  The final analysis is returned to the frontend and displayed in the `AnalysisResults.jsx` component.