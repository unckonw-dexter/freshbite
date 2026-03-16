// Netlify Function: /.netlify/functions/ai-chat
// POST body: { messages: [{role, content}], userContext: { diet, savedRecipes } }

const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `You are FreshBite's friendly nutrition assistant — knowledgeable, warm, and concise.

You help users with:
- Healthy recipe suggestions and meal ideas
- Nutrition questions and dietary advice
- Ingredient substitutions and cooking tips
- Meal planning and prep strategies
- Health and wellness guidance related to food

Your personality:
- Friendly and encouraging, not preachy
- Use occasional food emojis to be approachable
- Keep answers concise — 2-4 sentences unless a detailed list is truly needed
- Always be practical and actionable

Rules:
- Never give medical diagnoses or replace medical advice
- For medical conditions, suggest consulting a healthcare provider
- Focus on evidence-based nutrition science
- If asked about non-food topics, gently redirect to nutrition/cooking

You represent FreshBite — a healthy recipes and juice lab website. Occasionally mention relevant FreshBite features when appropriate (recipe search, juice lab, AI recipe generator).`;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { messages = [], userContext = {} } = body;

    if (!messages.length) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No messages provided.' }),
      };
    }

    // Validate message format
    const validMessages = messages
      .filter(m => m.role && m.content && typeof m.content === 'string')
      .slice(-10); // Keep last 10 messages for context window management

    if (!validMessages.length) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid message format.' }),
      };
    }

    // Build system prompt with user context
    let systemPrompt = SYSTEM_PROMPT;
    if (userContext.diet && userContext.diet !== 'any') {
      systemPrompt += `\n\nUser's dietary preference: ${userContext.diet}. Tailor suggestions accordingly.`;
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: validMessages,
    });

    const replyText = response.content[0].text;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        reply: replyText,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
        },
      }),
    };

  } catch (err) {
    console.error('AI Chat function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Chat is temporarily unavailable. Please try again.',
        details: err.message,
      }),
    };
  }
};
