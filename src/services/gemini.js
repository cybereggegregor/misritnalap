export async function analyzeComments(username, prompt, model, commentsData) {
  try {
    console.log('analyzeComments function called');
    // Call the Netlify function
    const response = await fetch('/.netlify/functions/gemini-analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username, 
        prompt, 
        model,
        commentsData 
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Response received from gemini-analyze:', data);
    console.log('Function log output:', data.logOutput);
    return data.analysis
  } catch (error) {
    console.error('Error analyzing comments:', error)
    throw new Error(`Failed to analyze comments: ${error.message}`)
  }
}