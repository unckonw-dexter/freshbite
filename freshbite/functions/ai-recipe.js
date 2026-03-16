// Netlify Function: /.netlify/functions/ai-recipe
// POST body: { ingredients: string[], diet: string, meal: string, customNote: string }

const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event, context) => {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = JSON.parse(event.body || '{}');
    const { ingredients = [], diet = 'any', meal = 'any', customNote = '' } = body;

    if (!ingredients.length && !customNote) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Please provide at least one ingredient or note.' }),
      };
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `You are FreshBite's AI Recipe Chef. Generate ONE healthy, delicious recipe based on these requirements.

Ingredients available: ${ingredients.join(', ') || 'any healthy ingredients'}
Dietary preference: ${diet}
Meal type: ${meal}
Additional notes: ${customNote || 'none'}

Respond with ONLY a JSON object in this exact format (no markdown, no extra text):
{
  "title": "Recipe Name",
  "emoji": "🥗",
  "time": "25 min",
  "servings": 2,
  "difficulty": "easy",
  "calories": 380,
  "description": "A brief enticing 1-2 sentence description",
  "ingredients": [
    {"amount": "1 cup", "name": "quinoa"},
    {"amount": "2 tbsp", "name": "olive oil"}
  ],
  "steps": [
    {"step": 1, "title": "Step Title", "instruction": "Detailed instruction here."},
    {"step": 2, "title": "Step Title", "instruction": "Detailed instruction here."}
  ],
  "tips": ["Pro tip 1", "Pro tip 2"],
  "nutrition": {
    "protein": "18g",
    "carbs": "42g",
    "fat": "12g",
    "fiber": "8g"
  },
  "tags": ["vegan", "gluten-free"]
}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = response.content[0].text.trim();
    
    // Clean and parse JSON
    let recipeData;
    try {
      // Strip any markdown code fences if present
      const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();
      recipeData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr, 'Raw:', rawText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to parse recipe. Please try again.' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, recipe: recipeData }),
    };

  } catch (err) {
    console.error('AI Recipe function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Recipe generation failed. Please try again.',
        details: err.message 
      }),
    };
  }
};
