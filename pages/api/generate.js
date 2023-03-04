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
      messages: [{role: "user", content: `
      Q:Topics to study as a beginner to C.
      A: Basic structure of C programming,declaring programs,attributes,methods, functions,  Data Types, Operators , Operator Precedence
      Q:Topics to study as a beginner to photography.
      A:Learn to hold your camera properly,Understand the exposure triangle,Learn to adjust white balance, Learn to read the histogram,Perspective
      Q: topics should I cover as a beginner to of ${promptInput}
      A: `}],
      temperature: 0.6,
      max_tokens:512
    });


    // TODO: Aggregate your response properly here and then send
      console.log(completion.data.choices[0].message);
      // call search api here 
     let list= parseResponseforSearch(completion.data.choices[0].message.content)
     callALMSearch(list[0]);
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

function parseResponseforSearch(content){
  // Parsing search result here 
  let list=content.split(",")
  return list;
}

function callALMSearch(searchItem){
// call public search api here and get courses list
fetch(`https://learningmanagerstage1.adobe.com/primeapi/v2/search?page[limit]=10&query=${searchItem}&autoCompleteMode=false&filter.loTypes=course&sort=relevance&filter.ignoreEnhancedLP=true&matchType=phrase_and_match&persistSearchHistory=true`, {
  "headers": {
    "accept": "application/vnd.api+json;charset=UTF-8",
    "accept-language": "en-IN,en-GB;q=0.9,en;q=0.8,en-US;q=0.7",
    "authorization": "oauth 4f911767a78ca9171d3b27e6c2aba47c",
    "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://learningmanagerstage1.adobe.com/docs/primeapi/v2/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
}).then(res=> res.json()).then((res)=>console.log(res));
}

// function generatePrompt(prompt) {
//   return `what topics should I cover as a beginner salesperson of ${prompt}`;
// }
