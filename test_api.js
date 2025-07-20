/**
 * Test the OpenRouter.ai LLM API
 */
const axios = require('axios');

async function testApi() {
  try {
    const apiKey = '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';
    
    console.log('Testing OpenRouter API with key:', apiKey);
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nousresearch/deephermes-3-llama-3-8b-preview:free',
        messages: [
          { role: 'system', content: 'You are a virtual doctor assistant. Provide detailed medical information.' },
          { role: 'user', content: 'I have a headache and fever' }
        ],
        max_tokens: 1000,
        temperature: 0.4,
        top_p: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://virtualhospital.com', // Replace with your actual domain
          'X-Title': 'Virtual Hospital'
        }
      }
    );
    
    console.log('API Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('API Error:');
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

testApi();
