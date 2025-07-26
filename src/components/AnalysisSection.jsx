import { useState } from 'react'
import PropTypes from 'prop-types'
import { analyzeComments } from '../services/gemini'
import { GEMINI_MODELS, PROMPT_DEFINITIONS, DEFAULT_ANALYSIS_PROMPT } from '../constants/prompts'
import { Button } from "@/components/ui/button"

function AnalysisSection({ username, commentsData, onAnalysisComplete, onAnalysisError, status, onStatusChange }) {
  const [selectedModel, setSelectedModel] = useState(GEMINI_MODELS[0])
  const [customPrompt, setCustomPrompt] = useState('')

  const handleAnalyze = async (promptType = null) => {
    const prompt = promptType ? PROMPT_DEFINITIONS[promptType] : (customPrompt.trim() || DEFAULT_ANALYSIS_PROMPT)
    if (!commentsData || commentsData.length === 0) {
      onAnalysisError('No comments data available for analysis. Please fetch comments first.')
      return
    }
    
    onStatusChange({ status: 'analyzing', result: null, error: null })

    try {
      const result = await analyzeComments(username, prompt, selectedModel, commentsData)
      onAnalysisComplete(result)
    } catch (error) {
      onAnalysisError(error.message)
    }
  }

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        AI Analysis
      </h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            AI Model
          </label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={status.status === 'analyzing'}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            {GEMINI_MODELS.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom Analysis Prompt
          </label>
          <textarea
            id="custom-prompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter custom prompt or leave blank for default analysis..."
            rows={4}
            disabled={status.status === 'analyzing'}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>

        <div className="pt-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Prompts</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PROMPT_DEFINITIONS).map(([key, _]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => handleAnalyze(key)}
                disabled={status.status === 'analyzing' || !commentsData || commentsData.length === 0}
              >
                {getPromptDisplayName(key)}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <Button
            onClick={() => handleAnalyze()}
            disabled={status.status === 'analyzing' || !commentsData || commentsData.length === 0}
          >
            {status.status === 'analyzing' ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Execute Analysis</span>
            )}
          </Button>
        </div>

        {status.status === 'analyzing' && (
          <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-md text-sm">
            Generating AI analysis, this may take a moment...
          </div>
        )}

        {status.error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
            <strong>Error:</strong> {status.error}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
        Analysis powered by{' '}
        <a
          href="https://ai.google.dev/models/gemini"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Google AI
        </a>
      </p>
    </section>
  )
}

function getPromptDisplayName(key) {
  const displayNames = {
    findDirt: '🕵️ Find Dirt',
    comprehensiveProfile: 'Comprehensive Profile',
    topInterests: 'Top Interests',
    coreValues: 'Core Values',
    onlinePersona: 'Online Persona',
    interactionPatterns: 'Interaction Patterns',
    controversialTopics: 'Controversial Topics',
    religiousSleuth: '🕵️‍♂️ Religious Sleuth',
    threatAnalysis: '🚨 Threat Analysis',
    mindBlower: '🤯 Mind Blower'
  }
  return displayNames[key] || key
}

AnalysisSection.propTypes = {
  username: PropTypes.string.isRequired,
  commentsData: PropTypes.array,
  onAnalysisComplete: PropTypes.func.isRequired,
  onAnalysisError: PropTypes.func.isRequired,
  status: PropTypes.shape({
    status: PropTypes.string.isRequired,
    result: PropTypes.string,
    error: PropTypes.string
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired
}

export default AnalysisSection