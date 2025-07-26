import PropTypes from 'prop-types'

function AnalyticsSection({ analytics }) {
  return (
    <div className="card rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        📊 Analytics Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card rounded-md p-4">
          <h4 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">Overview</h4>
          <div className="space-y-2">
            <div>Total Comments: <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.total_comments}</span></div>
            <div>Average Score: <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.avg_score}</span></div>
            <div>Unique Subreddits: <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.unique_subreddits}</span></div>
          </div>
        </div>

        <div className="card rounded-md p-4">
          <h4 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">Top Subreddits</h4>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {Object.entries(analytics.top_subreddits || {}).map(([subreddit, count]) => (
              <div key={subreddit} className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">r/{subreddit}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

AnalyticsSection.propTypes = {
  analytics: PropTypes.shape({
    total_comments: PropTypes.number.isRequired,
    avg_score: PropTypes.number.isRequired,
    unique_subreddits: PropTypes.number.isRequired,
    top_subreddits: PropTypes.object
  }).isRequired
}

export default AnalyticsSection