import { GoogleGenerativeAI } from '@google/generative-ai'

export async function handler(event, context) {
  let logOutput = '';
  console.log('gemini-analyze function triggered');
  logOutput += 'gemini-analyze function triggered\n';
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { username, prompt, model, commentsData } = JSON.parse(event.body)
    
    if (!username || !prompt || !model) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Username, prompt, and model are required' })
      }
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Gemini API key not configured', logOutput: logOutput })
      }
    }

    // Initialize Gemini AI
    console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
    logOutput += `GEMINI_API_KEY: ${process.env.GEMINI_API_KEY}\n`;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    // Get the model
    console.log('Model:', model);
    logOutput += `Model: ${model}\n`;
    let geminiModel
    try {
      geminiModel = genAI.getGenerativeModel({ model: model.replace('models/', '') })
      console.log('Gemini Model:', geminiModel);
      logOutput += `Gemini Model: ${geminiModel}\n`;
    } catch (error) {
      console.error('Error getting Gemini model:', error);
      logOutput += `Error getting Gemini model: ${error.message}\n`;
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: `Invalid model: ${model}`, logOutput: logOutput })
      }
    }

    // Prepare the content for analysis
    let commentsContent = ''
    if (commentsData && Array.isArray(commentsData)) {
      commentsContent = commentsData.map(comment => 
        `[${comment.subreddit}] [${comment.created_utc}] (Score: ${comment.score}) ${comment.body}`
      ).join('\n')
    } else {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Comments data is required for analysis', logOutput: logOutput })
      }
    }

    // Limit content length based on model capabilities
    const maxContentLength = model.includes('1.5') || model.includes('2.') ? 4000000 : 100000
    console.log('Comments content length before truncation:', commentsContent.length);
    logOutput += `Comments content length before truncation: ${commentsContent.length}\n`;
    if (commentsContent.length > maxContentLength) {
      commentsContent = commentsContent.substring(0, maxContentLength) + '\n... (content truncated for API limits)'
    }
    console.log('Comments content length after truncation:', commentsContent.length);
    logOutput += `Comments content length after truncation: ${commentsContent.length}\n`;

    // System prompt addition for context
    const systemPrompt = "All the following Reddit comments are from a single user. Focus your analysis on profiling this individual user based on their collective comments."
    
    const fullPrompt = `${systemPrompt}\n\n${prompt}\n\nComments data:\n${commentsContent}`

    try {
      // Generate content with safety settings
      const result = await geminiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.7,
        },
        safetySettings: [
          // Adjust safety settings based on desired content moderation.
          // BLOCK_NONE is very permissive. BLOCK_MEDIUM_AND_ABOVE is a more balanced default.
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      })

      const response = await result.response
      let analysisText = ''

      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0]
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          analysisText = candidate.content.parts[0].text
        } else {
          analysisText = 'AI analysis completed, but no content was generated.'
        }
      } else if (response.promptFeedback && response.promptFeedback.blockReason) {
        analysisText = `AI analysis was blocked due to safety concerns: ${response.promptFeedback.blockReason}.`
      } else {
        analysisText = 'AI analysis failed to generate a response. Please try again.'
      }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          analysis: analysisText,
          logOutput: logOutput,
          model: model,
          username: username
        })
      }

    } catch (apiError) {
      console.error('Gemini API error:', apiError);
      console.error('Gemini API error details:', apiError.message);
      logOutput += `Gemini API error: ${apiError.message}\n`;
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Failed to generate AI analysis',
          details: apiError.message,
          logOutput: logOutput
        })
      }
    }

  } catch (error) {
    console.error('Gemini analysis error:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        logOutput: logOutput,
        details: error.message 
      })
    }
  }
}