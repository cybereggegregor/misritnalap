# Frontend Component Analysis

This document provides a deep-dive analysis of the core frontend components.

### 1. `src/components/FetchSection.jsx`

This component is responsible for the user interface and logic required to fetch comments for a given Reddit username.

*   **State Management:**
    *   `username` (`useState('')`): A string that stores the value of the Reddit username input field.
    *   `commentLimit` (`useState(500)`): A number that stores the maximum number of comments to fetch. It is initialized to 500.

*   **Props:**
    *   `onUserFetched` (`PropTypes.func.isRequired`): A callback function that is invoked upon the successful fetching of comments. It passes the fetched `userData` and the `cleanUsername` to the parent component.
    *   `status` (`PropTypes.shape(...)`): An object that provides information about the current fetching status. It contains `status` (a string like 'fetching', 'complete', 'error'), `progress` (a number from 0-100), and `error` (a string message).
    *   `onStatusChange` (`PropTypes.func.isRequired`): A callback function used to update the `status` object in the parent component, allowing this component to communicate its current state (e.g., starting the fetch, updating progress, reporting an error).

*   **Key Functions/Event Handlers:**
    *   `handleSubmit` (`async (e) => { ... }`): This asynchronous function is the event handler for the form's `onSubmit` event. It prevents the default form submission, validates the `username` and `commentLimit` inputs, sets the status to 'fetching', and then calls the `fetchRedditComments` service. It uses a `try...catch` block to handle potential errors during the fetch, updating the status accordingly.
    *   `handleUsernameChange` (`(e) => { ... }`): This function handles both `onChange` and `onBlur` events for the username input. It updates the `username` state on every keystroke. On `blur`, it also uses the `extractUsername` utility to clean up the input (e.g., removing `u/` prefixes) and updates the state with the cleaned value.

*   **Interaction with Services/Hooks:**
    *   `extractUsername`: Imported from `../utils/reddit`, this utility function is used within `handleSubmit` and `handleUsernameChange` to sanitize the username string before it's used in the API call.
    *   `fetchRedditComments`: Imported from `../services/reddit`, this is the core service function called in `handleSubmit`. It performs the actual API request to the backend to retrieve the user's comments, accepting the username, a progress callback, and the comment limit as arguments.

### 2. `src/components/AnalysisSection.jsx`

This component provides the UI for initiating an AI-powered analysis of the fetched comments.

*   **State Management:**
    *   `selectedModel` (`useState(GEMINI_MODELS[0])`): A string that holds the currently selected AI model from the dropdown. It's initialized with the first model from the `GEMINI_MODELS` constant.
    *   `customPrompt` (`useState('')`): A string that stores the user's custom analysis prompt from the `textarea`.

*   **Props:**
    *   `username` (`PropTypes.string.isRequired`): The username of the user being analyzed, passed down to be included in the analysis request.
    *   `commentsData` (`PropTypes.array`): An array containing the fetched comment objects. This data is the primary input for the analysis. The component's UI is disabled if this prop is empty or null.
    *   `onAnalysisComplete` (`PropTypes.func.isRequired`): A callback function invoked when the AI analysis returns a successful result. It passes the result string to the parent.
    *   `onAnalysisError` (`PropTypes.func.isRequired`): A callback function invoked if an error occurs during analysis. It passes the error message to the parent.
    *   `status` (`PropTypes.shape(...)`): An object representing the analysis status, containing `status` ('analyzing', 'complete', 'error'), `result`, and `error`.
    *   `onStatusChange` (`PropTypes.func.isRequired`): A callback to update the analysis status in the parent component.

*   **Key Functions/Event Handlers:**
    *   `handleAnalyze` (`async (promptType = null) => { ... }`): This function is called when the user clicks either a "Quick Prompt" button or the main "Execute Analysis" button. It determines which prompt to use: a predefined one if `promptType` is provided, or the `customPrompt` (falling back to a default if the custom one is empty). It then sets the status to 'analyzing' and calls the `analyzeComments` service, handling the success or error with the appropriate callbacks.

*   **Interaction with Services/Hooks:**
    *   `analyzeComments`: Imported from `../services/gemini`, this function is called by `handleAnalyze` to send the analysis request to the backend. It takes the `username`, `prompt`, `selectedModel`, and `commentsData` as arguments.
    *   Constants from `src/constants/prompts.js`: The component imports `GEMINI_MODELS` to populate the model selection dropdown, `PROMPT_DEFINITIONS` to get the text for the "Quick Prompts", and `DEFAULT_ANALYSIS_PROMPT` as a fallback.

### 3. `src/components/AnalysisResults.jsx`

This is a presentational component designed to display the results of the AI analysis.

*   **State Management:**
    *   This component is stateless and does not use `useState`. Its content is derived entirely from its props.

*   **Props:**
    *   `analysisResults` (`PropTypes.string`): A string containing the formatted text of the analysis result. If this prop is `null` or `undefined`, the component displays a placeholder message. Otherwise, it renders the results.

*   **Key Functions/Event Handlers:**
    *   `handleCopy` (`() => { ... }`): This function is the `onClick` handler for the "COPY" button. It uses the browser's `navigator.clipboard.writeText()` API to copy the entire `analysisResults` string to the user's clipboard.

*   **Interaction with Services/Hooks:**
    *   This component does not interact directly with any services or custom hooks. It only receives data via props and renders it.