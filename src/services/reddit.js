export async function fetchRedditComments(username, onProgress, limit = 500) {
  try {
    // Call the Netlify function
    const response = await fetch('/.netlify/functions/reddit-fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, limit })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Simulate progress for better UX
    for (let i = 0; i <= 100; i += 20) {
      onProgress(i)
      if (i < 100) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return {
      comments: data.comments,
    }
  } catch (error) {
    console.error('Error fetching Reddit comments:', error)
    throw new Error(`Failed to fetch comments: ${error.message}`)
  }
}