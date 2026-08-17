const OpenAI = require('openai');

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTask = async(prompt) => {
    if (!prompt || !prompt.trim()) {
        throw new Error('Prompt is required');
    }

    const response = await client.responses.create({
        model: 'gpt-5.4-mini',
        input: `
You are an AI assistant for a task management application.

Convert the user's request into a task.

User request:
${prompt}

Return ONLY valid JSON in this exact format:

{
  "title": "string",
  "description": "string",
  "priority": "Most Important"
}

Do not include markdown, code fences, or any extra text.
        `,
    });

    const result = JSON.parse(response.output_text);

    return {
        title: result.title || '',
        description: result.description || '',
        priority: result.priority || 'Most Important',
    };
};

module.exports = {
    generateTask,
};