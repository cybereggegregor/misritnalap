import PropTypes from 'prop-types'

function DownloadSection({ username, downloadUrl }) {
  return (
    <div className="card rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Download Complete!
      </h3>
      <a
        href={downloadUrl}
        download={`${username}_comments.txt`}
        className="inline-block bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md font-medium transition-colors"
      >
        Download Comments File
      </a>
    </div>
  )
}

DownloadSection.propTypes = {
  username: PropTypes.string.isRequired,
  downloadUrl: PropTypes.string.isRequired
}

export default DownloadSection