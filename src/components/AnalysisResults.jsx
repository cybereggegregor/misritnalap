import PropTypes from 'prop-types'
import { Button } from "@/components/ui/button"

function AnalysisResults({ analysisResults }) {
  if (!analysisResults) {
    return (
      <div className="bg-base p-6 rounded-lg border-l-4 border-accent-gemini h-full flex items-center justify-center">
        <div className="text-center text-text-color-light">
          <h2 className="font-space-grotesk text-accent-gemini text-2xl mb-4">
            Analysis Results
          </h2>
          <p>Analysis results will appear here once an analysis is complete.</p>
        </div>
      </div>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(analysisResults);
  };

  return (
    <div className="bg-base p-6 rounded-lg border-l-4 border-accent-gemini">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-space-grotesk text-accent-gemini text-2xl">
          Analysis Results
        </h2>
        <Button onClick={handleCopy} size="sm">COPY</Button>
      </div>
      <div className="bg-secondary-bg rounded-lg p-6 shadow-lg">
        <div className="text-text-color leading-relaxed max-h-[400px] overflow-y-auto p-4 bg-base rounded-md">
          {analysisResults.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

AnalysisResults.propTypes = {
  analysisResults: PropTypes.string,
}

export default AnalysisResults