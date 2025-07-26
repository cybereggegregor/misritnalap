// static/script.js

// --- Constants for DOM Elements ---
const DOM = {
    themeToggle: document.querySelector('.theme-toggle'),
    usernameInput: document.getElementById('username'),
    fetchBtn: document.getElementById('fetchBtn'),
    progressContainer: document.getElementById('progressContainer'),
    progressText: document.getElementById('progressText'),
    progressFill: document.getElementById('progressFill'),
    commentCount: document.getElementById('commentCount'),
    statusDiv: document.getElementById('status'),
    savedUsersSection: document.getElementById('savedUsersSection'),
    savedUsersList: document.getElementById('savedUsersList'),
    downloadAnalysisSection: document.getElementById('downloadAnalysisSection'), // New wrapper
    downloadLink: document.getElementById('downloadLink'),
    analyticsSection: document.getElementById('analyticsSection'),
    totalComments: document.getElementById('totalComments'),
    avgScore: document.getElementById('avgScore'),
    uniqueSubreddits: document.getElementById('uniqueSubreddits'),
    topSubreddits: document.getElementById('topSubreddits'),
    geminiModelSelect: document.getElementById('geminiModelSelect'),
    analysisPrompt: document.getElementById('analysisPrompt'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    quickAnalysisButtons: document.querySelectorAll('.quick-analysis-buttons button'),
    aiAnalysisResultsSection: document.getElementById('aiAnalysisResultsSection'), // Renamed for clarity
    copyGeminiOutputBtn: document.getElementById('copyGeminiOutputBtn'),
    geminiOutputContent: document.getElementById('gemini-output-content'),
    copyFeedback: document.getElementById('copyFeedback'),
};

// --- API Endpoints ---
const API_ENDPOINTS = {
    FETCH: '/fetch',
    PROGRESS: '/progress',
    ANALYZE: '/analyze',
    SAVED_USERS: '/saved_users',
    GET_USER_DATA: '/get_user_data',
};

// --- Gemini Model Options ---
const GEMINI_MODELS = [
z   "models/gemini-1.5-flash-latest",
    "models/gemini-1.5-pro-latest",
    "models/gemini-2.5-flash",
    "models/gemini-2.5-flash-preview-05-20",
    "models/gemini-2.5-pro",
    "models/gemini-2.5-pro-preview-06-05",
    "models/gemma-3-27b-it",
    "models/gemini-1.0-pro",
];

let progressInterval; // Global variable for the progress polling interval

// --- Utility Functions ---

/**
 * Extracts username from a Reddit URL or returns the input if it's just a username.
 * @param {string} input - The user input (username or URL).
 * @returns {string} The extracted username.
 */
function extractUsername(input) {
    const regex = /reddit\.com\/(?:user|u)\/([a-zA-Z0-9_-]+)/i;
    const match = input.match(regex);
    return match ? match[1] : input;
}

/**
 * Toggles between light and dark themes.
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    DOM.themeToggle.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('theme', newTheme);
}

/**
 * Populates the Gemini model dropdown with available options.
 */
function populateModelDropdown() {
    DOM.geminiModelSelect.innerHTML = '';
    GEMINI_MODELS.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        DOM.geminiModelSelect.appendChild(option);
    });
    DOM.geminiModelSelect.value = "models/gemini-1.5-flash-latest"; // Set default
}

/**
 * Displays a status message to the user.
 * @param {string} message - The message to display.
 * @param {'success'|'error'|'info'} type - The type of message for styling.
 */
function updateStatus(message, type) {
    DOM.statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
    DOM.statusDiv.setAttribute('aria-live', 'polite'); // Announce changes for screen readers
}

/**
 * Shows a DOM element.
 * @param {HTMLElement} element - The element to show.
 */
function showElement(element) {
    if (element) element.style.display = 'block';
}

/**
 * Hides a DOM element.
 * @param {HTMLElement} element - The element to hide.
 */
function hideElement(element) {
    if (element) element.style.display = 'none';
}

/**
 * Enables a button.
 * @param {HTMLElement} button - The button to enable.
 */
function enableButton(button) {
    if (button) button.disabled = false;
}

/**
 * Disables a button.
 * @param {HTMLElement} button - The button to disable.
 */
function disableButton(button) {
    if (button) button.disabled = true;
}

/**
 * Resets the UI to its initial state after a fetch operation.
 */
function resetFetchUI() {
    enableButton(DOM.fetchBtn);
    // Keep progress container visible if it's showing a final status, hide if it's just reset
    // For now, we'll keep it visible after completion/error to show final state.
}

/**
 * Clears previous analysis results and hides the section.
 */
function clearAnalysisResults() {
    DOM.geminiOutputContent.textContent = '';
    hideElement(DOM.aiAnalysisResultsSection);
    DOM.copyFeedback.classList.remove('show');
}

// --- Main Logic Functions ---

/**
 * Handles the initiation of fetching comments.
 */
async function handleFetchComments() {
    let username = DOM.usernameInput.value.trim();
    username = extractUsername(username);

    if (!username) {
        updateStatus('Please enter a username', 'error');
        return;
    }

    disableButton(DOM.fetchBtn);
    showElement(DOM.progressContainer);
    hideElement(DOM.downloadAnalysisSection);
    hideElement(DOM.analyticsSection);
    clearAnalysisResults();
    DOM.statusDiv.innerHTML = ''; // Clear previous status

    try {
        const response = await fetch(API_ENDPOINTS.FETCH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username })
        });
        const data = await response.json();

        if (data.error) {
            updateStatus(data.error, 'error');
            resetFetchUI();
        } else {
            progressInterval = setInterval(checkProgress, 500);
        }
    } catch (error) {
        updateStatus('Error starting fetch: ' + error.message, 'error');
        resetFetchUI();
    }
}

/**
 * Polls the server for progress updates.
 */
async function checkProgress() {
    try {
        const response = await fetch(API_ENDPOINTS.PROGRESS);
        const data = await response.json();
        updateProgressBar(data);

        if (data.status === 'complete') {
            clearInterval(progressInterval);
            showDownloadSection(data.filename);
            showAnalyticsDashboard(data.analytics);
            updateStatus('Comments fetched successfully! Ready for AI analysis ✨', 'success');
            resetFetchUI();
            loadSavedUsers(); // Refresh saved users list
            showElement(DOM.downloadAnalysisSection); // Ensure this section is visible
        } else if (data.status === 'error') {
            clearInterval(progressInterval);
            updateStatus('Error: ' + data.error, 'error');
            resetFetchUI();
        }
    } catch (error) {
        clearInterval(progressInterval);
        updateStatus('Error checking progress: ' + error.message, 'error');
        resetFetchUI();
    }
}

/**
 * Updates the progress bar and text.
 * @param {object} data - Progress data from the server.
 */
function updateProgressBar(data) {
    DOM.progressFill.style.width = data.progress + '%';
    DOM.progressFill.setAttribute('aria-valuenow', data.progress);

    let statusText = '';
    switch(data.status) {
        case 'starting': statusText = 'Starting...'; break;
        case 'loading_existing': statusText = 'Loading existing comments...'; break;
        case 'fetching_from_reddit': statusText = 'Fetching new comments from Reddit...'; break;
        case 'processing': statusText = `Processing comments...`; break;
        case 'saving': statusText = 'Saving to file...'; break;
        default: statusText = data.status;
    }
    DOM.progressText.textContent = statusText;

    if (data.current > 0) {
        DOM.commentCount.textContent = `${data.current} comments processed`;
        if (data.total > 0 && data.status === 'complete') {
            DOM.commentCount.textContent = `${data.current} total comments`;
        }
    } else {
        DOM.commentCount.textContent = '';
    }
}

/**
 * Displays the download link section.
 * @param {string} filename - The name of the file to download.
 */
function showDownloadSection(filename) {
    DOM.downloadLink.href = `/download/${filename}`;
    showElement(DOM.downloadAnalysisSection);
}

/**
 * Displays the analytics dashboard.
 * @param {object} analytics - Analytics data.
 */
function showAnalyticsDashboard(analytics) {
    if (!analytics || Object.keys(analytics).length === 0) {
        hideElement(DOM.analyticsSection);
        return;
    }

    showElement(DOM.analyticsSection);
    DOM.totalComments.textContent = analytics.total_comments || 0;
    DOM.avgScore.textContent = analytics.avg_score || 0;
    DOM.uniqueSubreddits.textContent = analytics.unique_subreddits || 0;

    DOM.topSubreddits.innerHTML = '';
    if (analytics.top_subreddits) {
        Object.entries(analytics.top_subreddits).forEach(([subreddit, count]) => {
            const item = document.createElement('div');
            item.className = 'analytics-item';
            item.innerHTML = `<span>r/${subreddit}</span><span>${count}</span>`;
            DOM.topSubreddits.appendChild(item);
        });
    }
}

/**
 * Handles the AI analysis request.
 */
async function handleAnalyzeComments() {
    let prompt = DOM.analysisPrompt.value.trim();
    if (!prompt) {
        prompt = DEFAULT_ANALYSIS_PROMPT;
    }

    const filename = DOM.downloadLink.getAttribute('href').split('/').pop();
    if (!filename || filename === '#') {
        updateStatus('Please fetch comments first before attempting analysis.', 'error');
        return;
    }

    const selectedModel = DOM.geminiModelSelect.value;

    disableButton(DOM.analyzeBtn);
    DOM.analyzeBtn.innerHTML = '✨ Analyzing with Selected Model...';

    DOM.geminiOutputContent.textContent = 'Generating analysis...';
    DOM.copyFeedback.classList.remove('show'); // Hide copy feedback

    try {
        const response = await fetch(API_ENDPOINTS.ANALYZE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filename: filename,
                prompt: prompt,
                model_name: selectedModel
            })
        });
        const data = await response.json();

        if (data.error) {
            updateStatus(data.error, 'error');
            hideElement(DOM.aiAnalysisResultsSection);
        } else {
            showElement(DOM.aiAnalysisResultsSection);
            DOM.geminiOutputContent.textContent = data.analysis;
            updateStatus('✨ AI analysis completed!', 'success');

            // Clear prompt if it was the default one
            if (prompt === DEFAULT_ANALYSIS_PROMPT) {
                DOM.analysisPrompt.value = '';
            }
            DOM.aiAnalysisResultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        updateStatus('Error during AI analysis: ' + error.message, 'error');
        hideElement(DOM.aiAnalysisResultsSection);
    } finally {
        enableButton(DOM.analyzeBtn);
        DOM.analyzeBtn.innerHTML = '✨ Analyze with Selected Model';
    }
}

/**
 * Sets a quick analysis prompt and triggers analysis.
 * @param {string} promptType - The key for the prompt in PROMPT_DEFINITIONS.
 */
async function setAndAnalyzePrompt(promptType) {
    const promptText = PROMPT_DEFINITIONS[promptType];
    if (!promptText) {
        console.error(`Prompt type "${promptType}" not found.`);
        updateStatus('Invalid quick analysis prompt selected.', 'error');
        return;
    }

    const filename = DOM.downloadLink.getAttribute('href').split('/').pop();
    if (!filename || filename === '#') {
        updateStatus('Please fetch comments first before attempting analysis.', 'error');
        return;
    }

    DOM.analysisPrompt.value = promptText;
    await handleAnalyzeComments();
}

/**
 * Handles copying the AI analysis output to the clipboard.
 */
async function handleCopyOutput() {
    const textToCopy = DOM.geminiOutputContent.innerText;

    try {
        await navigator.clipboard.writeText(textToCopy);
        DOM.copyFeedback.textContent = 'Copied!';
        DOM.copyFeedback.style.backgroundColor = 'var(--success-color)';
        DOM.copyFeedback.classList.add('show');
        setTimeout(() => DOM.copyFeedback.classList.remove('show'), 2000);
    } catch (err) {
        console.error('Failed to copy text using Clipboard API: ', err);
        const success = fallbackCopyTextToClipboard(textToCopy);
        if (success) {
            DOM.copyFeedback.textContent = 'Copied (fallback)!';
            DOM.copyFeedback.style.backgroundColor = 'var(--success-color)';
        } else {
            console.error('Fallback copy also failed.');
            DOM.copyFeedback.textContent = 'Copy failed!';
            DOM.copyFeedback.style.backgroundColor = 'var(--error-color)';
        }
        DOM.copyFeedback.classList.add('show');
        setTimeout(() => DOM.copyFeedback.classList.remove('show'), 3000);
    }
}

/**
 * Fallback function to copy text to clipboard for browsers that don't support
 * navigator.clipboard.writeText() or in non-secure contexts.
 * @param {string} text The text to copy.
 * @returns {boolean} True if copy was successful, false otherwise.
 */
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let successful = false;
    try {
        successful = document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    } finally {
        document.body.removeChild(textArea);
    }
    return successful;
}

/**
 * Loads saved users from the backend and populates the list.
 */
async function loadSavedUsers() {
    DOM.savedUsersList.innerHTML = '<p>Loading saved users...</p>';
    showElement(DOM.savedUsersSection);

    try {
        const response = await fetch(API_ENDPOINTS.SAVED_USERS);
        const data = await response.json();

        if (data.users && data.users.length > 0) {
            DOM.savedUsersList.innerHTML = '';
            data.users.forEach(username => {
                const userButton = document.createElement('button');
                userButton.className = 'saved-user-btn';
                userButton.textContent = username;
                userButton.onclick = () => loadExistingUserFile(username);
                DOM.savedUsersList.appendChild(userButton);
            });
        } else {
            DOM.savedUsersList.innerHTML = '<p>No users saved yet.</p>';
        }
    } catch (error) {
        console.error('Error loading saved users:', error);
        DOM.savedUsersList.innerHTML = '<p>Error loading saved users.</p>';
    }
}

/**
 * Loads analytics and download link for an already saved user.
 * @param {string} username - The username of the saved user.
 */
async function loadExistingUserFile(username) {
    try {
        const response = await fetch(`${API_ENDPOINTS.GET_USER_DATA}/${username}`);
        const data = await response.json();
        if (data.filename && data.analytics) {
            DOM.usernameInput.value = username; // Set username input
            showDownloadSection(data.filename);
            showAnalyticsDashboard(data.analytics);
            clearAnalysisResults(); // Clear previous analysis
            updateStatus(`User '${username}' data loaded. Ready for AI analysis or re-fetch.`, 'info');
        } else {
            updateStatus(`No data found for '${username}' or file is incomplete.`, 'warning');
            hideElement(DOM.downloadAnalysisSection);
            hideElement(DOM.analyticsSection);
            clearAnalysisResults();
        }
    } catch (error) {
        console.error('Error loading existing user data:', error);
        updateStatus(`Error loading data for '${username}'.`, 'error');
        hideElement(DOM.downloadAnalysisSection);
        hideElement(DOM.analyticsSection);
        clearAnalysisResults();
    }
}

// --- Initialization ---

/**
 * Sets up all event listeners for the page.
 */
function setupEventListeners() {
    DOM.themeToggle.addEventListener('click', toggleTheme);
    DOM.fetchBtn.addEventListener('click', handleFetchComments);
    DOM.usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleFetchComments();
    });
    DOM.analyzeBtn.addEventListener('click', handleAnalyzeComments);
    DOM.analysisPrompt.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Allow Shift+Enter for new line
            e.preventDefault(); // Prevent default new line
            handleAnalyzeComments();
        }
    });
    DOM.copyGeminiOutputBtn.addEventListener('click', handleCopyOutput);

    DOM.quickAnalysisButtons.forEach(button => {
        button.addEventListener('click', () => {
            const promptType = button.dataset.promptType;
            if (promptType) {
                setAndAnalyzePrompt(promptType);
            }
        });
    });

    // Handle username input blur to clean up URL
    DOM.usernameInput.addEventListener('blur', function() {
        const input = this.value.trim();
        const username = extractUsername(input);
        if (username !== input) {
            this.value = username;
        }
    });
}

/**
 * Initializes the application on DOM content loaded.
 */
function init() {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    DOM.themeToggle.textContent = savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';

    populateModelDropdown();
    setupEventListeners();
    loadSavedUsers(); // Load saved users on page load
}

// Attach init function to DOMContentLoaded event
document.addEventListener('DOMContentLoaded', init);
