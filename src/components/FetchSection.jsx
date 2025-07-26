import { useState } from 'react'
import PropTypes from 'prop-types'
import { extractUsername } from '../utils/reddit'
import { fetchRedditComments } from '../services/reddit'
import { Button } from "@/components/ui/button"

function FetchSection({ onUserFetched, status, onStatusChange }) {
  const [username, setUsername] = useState('')
  const [commentLimit, setCommentLimit] = useState(500) // Default limit

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanUsername = extractUsername(username.trim())
    
    if (!cleanUsername) {
      onStatusChange({ status: 'error', progress: 0, error: 'Please enter a valid username' })
      return
    }

    if (commentLimit <= 0) {
      onStatusChange({ status: 'error', progress: 0, error: 'Comment limit must be a positive number' })
      return
    }

    onStatusChange({ status: 'fetching', progress: 0, error: null })

    try {
      const userData = await fetchRedditComments(cleanUsername, (progress) => {
        onStatusChange({ status: 'fetching', progress, error: null })
      }, commentLimit) // Pass the commentLimit
      
      onStatusChange({ status: 'complete', progress: 100, error: null })
      onUserFetched(userData, cleanUsername)
    } catch (error) {
      onStatusChange({ status: 'error', progress: 0, error: error.message })
    }
  }

  const handleUsernameChange = (e) => {
    const value = e.target.value
    setUsername(value)
    
    // Auto-clean username on blur
    if (e.type === 'blur') {
      const cleaned = extractUsername(value.trim())
      if (cleaned !== value.trim()) {
        setUsername(cleaned)
      }
    }
  }

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Fetch Comments
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reddit Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameChange}
              placeholder="e.g., spez"
              disabled={status.status === 'fetching'}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="commentLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comment Limit
            </label>
            <input
              type="number"
              id="commentLimit"
              value={commentLimit}
              onChange={(e) => setCommentLimit(parseInt(e.target.value) || 0)}
              min="1"
              disabled={status.status === 'fetching'}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="w-full">
            {status.status === 'fetching' && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${status.progress}%` }}
                ></div>
              </div>
            )}
            {status.status === 'fetching' && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">Fetching comments... {status.progress}%</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={status.status === 'fetching'}
          >
            {status.status === 'fetching' ? 'Fetching...' : 'Fetch'}
          </Button>
        </div>

        {status.error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
            <strong>Error:</strong> {status.error}
          </div>
        )}

        {status.status === 'complete' && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-md text-sm flex items-center">
            {/* Checkmark SVG removed for debugging */}
            <span>Success! Comments fetched and ready for analysis.</span>
          </div>
        )}
      </form>
    </section>
  )
}

FetchSection.propTypes = {
  onUserFetched: PropTypes.func.isRequired,
  status: PropTypes.shape({
    status: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    error: PropTypes.string
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired
}

export default FetchSection