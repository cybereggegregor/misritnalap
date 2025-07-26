import fetch from 'cross-fetch';

async function getRedditAccessToken(clientId, clientSecret, userAgent) {
  const tokenUrl = 'https://www.reddit.com/api/v1/access_token';
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  console.log("Attempting to get Mis Ritnalap access token...");
  console.log("Using User-Agent:", userAgent);

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'User-Agent': userAgent,
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Failed to get access token. Status:", response.status, "Body:", errorBody);
      throw new Error(`Failed to get Mis Ritnalap access token: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    console.log("Successfully obtained Mis Ritnalap access token.");
    return data.access_token;
  } catch (error) {
    console.error("Error getting Mis Ritnalap access token:", error);
    throw error;
  }
}
exports.handler = async function (event, context) {
  const { limit, accessToken } = JSON.parse(event.body);
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const userAgent = process.env.REDDIT_USER_AGENT;

  if (!clientId || !clientSecret || !userAgent) {
    console.error("Missing Reddit API credentials in environment variables.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Mis Ritnalap API credentials. Please check your .env file or Netlify environment variables." }),
    };
  }

  const fetchLimit = limit && typeof limit === 'number' && limit > 0 ? limit : 100;

  try {
    // Use the provided access token
    console.log(`Fetching comments with access token: ${accessToken} with limit: ${fetchLimit}`);
    const redditApiUrl = `https://oauth.reddit.com/me/comments.json?limit=${fetchLimit}`;

    const response = await fetch(redditApiUrl, {
      headers: {
        'User-Agent': userAgent,
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Mis Ritnalap API error. Status:", response.status, "Body:", errorBody);
      throw new Error(`Mis Ritnalap API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    const comments = data.data.children.map(child => child.data);
    console.log(`Successfully fetched ${comments.length} comments.`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        comments,
      }),
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}