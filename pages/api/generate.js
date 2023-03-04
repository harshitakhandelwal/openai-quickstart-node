const { Configuration, OpenAIApi } = require("openai");
const { toChatML, get_message } = require("gpt-to-chatgpt")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const promptInput = req.body.prompt || '';
  if (promptInput.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt text",
      }
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0301",
      messages: [{role: "user", content: `what topics should I cover as a beginner salesperson of ${promptInput}`}],
      temperature: 0.6,
      max_tokens:512
    });


    // TODO: Aggregate your response properly here and then send
      console.log(completion.data.choices[0].message)
    res.status(200).json({ result: completion.data.choices[0].message.content });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(prompt) {
  return `what topics should I cover as a beginner salesperson of ${prompt}`;
}
