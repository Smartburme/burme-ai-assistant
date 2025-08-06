addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // API endpoint for OpenAI
  const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
  
  // Headers for OpenAI API
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${WAYNE_API_KEY}`
  };

  // Handle different request types
  if (request.method === 'POST') {
    const requestData = await request.json();
    
    const payload = {
      model: "gpt-3.5-turbo",
      messages: requestData.messages,
      temperature: 0.7
    };

    const aiResponse = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    const aiData = await aiResponse.json();
    return new Response(JSON.stringify(aiData), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Return simple response for GET requests
  return new Response(JSON.stringify({status: "BURME AI Worker Running"}), {
    headers: { 'Content-Type': 'application/json' }
  });
}
