import PropTypes from 'prop-types'
import { Button } from "@/components/ui/button"

function SavedUsers({ users, onUserSelect, currentUser }) {
  if (users.length === 0) return null

  return (
    <section className="bg-base p-6 rounded-lg border-l-4 border-accent-reddit mb-6">
      <h2 className="font-space-grotesk text-accent-reddit text-2xl mb-4">
        Saved Sessions
      </h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.username}>
            <Button
              onClick={() => onUserSelect(user.username)}
              variant={currentUser === user.username ? "default" : "outline"}
              className="w-full justify-start"
            >
              <span className="font-bold">{user.username}</span>
              <span className="text-xs text-gray-400 ml-2">
                - Fetched on {new Date(user.fetchedAt).toLocaleDateString()}
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}

SavedUsers.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    fetchedAt: PropTypes.string.isRequired,
    analytics: PropTypes.object
  })).isRequired,
  onUserSelect: PropTypes.func.isRequired,
  currentUser: PropTypes.string
}

export default SavedUsers