// src/index.ts
export default {
  async fetch(request, env) {
    // Handle CORS (if needed)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Parse the JSON body from the request
      const { prompt } = await request.json();

      if (!prompt) {
        return new Response('Prompt is required', { status: 400 });
      }

      // Run the AI model with the user-provided prompt
      const response = await env.AI.run(
        '@cf/stabilityai/stable-diffusion-xl-base-1.0',
        { prompt }
      );

      // Return the image as a response
      return new Response(response, {
        headers: {
          'content-type': 'image/png',
          'Access-Control-Allow-Origin': '*', // Allow CORS
        },
      });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};
