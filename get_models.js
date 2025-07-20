/**
 * Get available models from OpenRouter.ai
 * Usage: Set LLM_API_KEY environment variable before running
 */
require('dotenv').config();
const axios = require('axios');

async function getModels() {
  try {
    const apiKey = process.env.LLM_API_KEY;
    
    if (!apiKey) {
      console.error('❌ LLM_API_KEY environment variable is required!');
      console.error('Set it with: set LLM_API_KEY=your_api_key');
      process.exit(1);
    }
    
    console.log('Fetching available models from OpenRouter.ai...');
    
    const response = await axios.get(
      'https://openrouter.ai/api/v1/models',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Available Models:');
    if (response.data && response.data.data) {
      response.data.data.forEach(model => {
        console.log(`- ${model.id} (${model.context_length} tokens)`);
      });
    } else {
      console.log('Unexpected response format:', response.data);
    }
  } catch (error) {
    console.error('Error fetching models:');
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

getModels();
