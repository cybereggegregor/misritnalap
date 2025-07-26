import { useState, useEffect } from 'react'
import Header from './components/Header'
import FetchSection from './components/FetchSection'
import SavedUsers from './components/SavedUsers'
import DownloadSection from './components/DownloadSection'
import AnalyticsSection from './components/AnalyticsSection'
import AnalysisSection from './components/AnalysisSection'
import AnalysisResults from './components/AnalysisResults'
import { useTheme } from './hooks/useTheme'
import { useLocalStorage } from './hooks/useLocalStorage'
import RedditAuthModal from './components/RedditAuthModal';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [savedUsers, setSavedUsers] = useLocalStorage('savedUsers', []);
  const [savedAnalyses, setSavedAnalyses] = useLocalStorage('savedAnalyses', {}); // New state for saved analyses
  const [currentUser, setCurrentUser] = useState(null);
  const [fetchStatus, setFetchStatus] = useState({ status: 'idle', progress: 0, error: null });
  const [analysisStatus, setAnalysisStatus] = useState({ status: 'idle', result: null, error: null });
  const [analytics, setAnalytics] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [commentsData, setCommentsData] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useLocalStorage('redditAccessToken', null);

  useEffect(() => {
    if (!accessToken) {
      // Redirect to login page or show a message
      setIsAuthModalOpen(true);
    }
  }, [accessToken]);

  const handleUserFetched = (userData, fetchedUsername) => {
    if (!fetchedUsername) {
      console.error("handleUserFetched called without a username.");
      return; // Exit if no username is provided
    }

    setCurrentUser(fetchedUsername);
    setCommentsData(userData.comments);
    setAnalytics(null);
    setDownloadUrl(null);
    setAnalysisStatus({ status: 'idle', result: null, error: null });
    
    setSavedAnalyses(prev => {
      const newAnalyses = { ...prev };
      delete newAnalyses[fetchedUsername];
      return newAnalyses;
    });

    setSavedUsers(prevSavedUsers => {
      const existingUserIndex = prevSavedUsers.findIndex(u => u.username === fetchedUsername);
      
      const userEntry = {
        username: fetchedUsername,
        fetchedAt: new Date().toISOString(),
        comments: userData.comments,
      };

      let newSavedUsers = [...prevSavedUsers];

      if (existingUserIndex > -1) {
        // Update existing user
        newSavedUsers[existingUserIndex] = { ...newSavedUsers[existingUserIndex], ...userEntry };
      } else {
        // Add new user
        newSavedUsers.push(userEntry);
      }

      // Filter out any "unknown_user" entries, just in case
      newSavedUsers = newSavedUsers.filter(u => u.username !== 'unknown_user');

      // Sort users alphabetically by username
      newSavedUsers.sort((a, b) => a.username.localeCompare(b.username));
      
      return newSavedUsers;
    });
  }

  const handleUserSelected = (username) => {
    const user = savedUsers.find(u => u.username === username)
    if (user) {
      setCurrentUser(user.username)
      setAnalytics(null)
      setCommentsData(user.comments)
      setDownloadUrl(null) // Clear download URL for saved users

      // Load saved analysis if available
      const savedAnalysis = savedAnalyses[username];
      if (savedAnalysis) {
        setAnalysisStatus({ status: 'complete', result: savedAnalysis, error: null });
      } else {
        setAnalysisStatus({ status: 'idle', result: null, error: null });
      }
    }
  }

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="container mx-auto p-4">
        <button onClick={() => setIsAuthModalOpen(true)}>
          Authorize with Reddit
        </button>
        <RedditAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <FetchSection
              onUserFetched={(userData, username) => handleUserFetched(userData, username)}
              status={fetchStatus}
              onStatusChange={setFetchStatus}
            />

            {currentUser && (
              <AnalysisSection
                username={currentUser}
                commentsData={commentsData}
                onAnalysisComplete={(result) => {
                  setAnalysisStatus({ status: 'complete', result, error: null });
                  setSavedAnalyses(prev => ({
                    ...prev,
                    [currentUser]: result
                  }));
                }}
                onAnalysisError={(error) => setAnalysisStatus({ status: 'error', result: null, error })}
                status={analysisStatus}
                onStatusChange={setAnalysisStatus}
              />
            )}

            {savedUsers.length > 0 && (
              <SavedUsers
                users={savedUsers}
                onUserSelect={handleUserSelected}
                currentUser={currentUser}
              />
            )}

            {currentUser && downloadUrl && (
              <DownloadSection
                username={currentUser}
                downloadUrl={downloadUrl}
              />
            )}

            {currentUser && analytics && (
              <AnalyticsSection analytics={analytics} />
            )}
          </div>

          <div className="lg:col-span-2">
            <AnalysisResults analysisResults={analysisStatus.result} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App