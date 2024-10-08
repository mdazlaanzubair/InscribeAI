import axios from "axios";

// CONSTANTS
const CHATGPT_END_POINT = "https://api.openai.com/v1/chat/completions";
const CHATGPT_MODEL = "gpt-3.5-turbo";

// FUNCTION TO GENERATE RESPONSE FROM CHAT GPT BASED ON
// USER INPUT i.e. RESUME AND SELECTED JOB DESCRIPTION
// AND RETURN THE RESPONSE
export const talkToGPT = async (prompt, apiKey) => {
  // VALIDATING REQUIRED PARAMETERS
  if (!prompt || !apiKey) {
    console.error("Missing required parameters for the API call.");
    return { error: "Missing required parameters for the API call." };
  }

  // CONFIGURING HEADER FOR MAKING API CALL
  const config = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };

  // PREPARING PROMPT OBJECT FOR API
  const promptObj = {
    role: "user",
    content: prompt,
  };

  // PREPARING REQUEST BODY FOR THE API
  const reqBody = {
    model: CHATGPT_MODEL,
    messages: [promptObj],
  };

  // MAKING API CALL TO GET THE GPT RESPONSE USING TRY/CATCH
  try {
    // Send a POST request to the ChatGPT API
    const response = await axios.post(CHATGPT_END_POINT, reqBody, config);

    // Extract the message content from the API response
    // Return the message content
    return { coverLetter: response?.data?.choices[0]?.message.content };
  } catch (error) {
    // Handle specific errors based on status code
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        return {
          error: "Invalid API key. Please check your key or get a new one.",
        };
      } else if (status === 429) {
        return {
          error:
            "Rate limit exceeded. Please wait before making more requests.",
        };
      } else if (status === 500) {
        return {
          error: "Server error. Please try again later.",
        };
      } else {
        return {
          error: `An error occurred: ${
            error.response.data.message || "Unknown error."
          }`,
        };
      }
    } else {
      // Handle network errors or other unforeseen errors
      console.error("Error with ChatGPT API:", error.message);
      return {
        error:
          "An unexpected error occurred. Please check your connection and try again.",
      };
    }
  }
};
