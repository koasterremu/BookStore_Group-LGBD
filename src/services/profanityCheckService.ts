import axios from "axios";

const HF_API_KEY = "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"; // Make sure to replace with your actual API key

export const checkProfanityWithHuggingFace = async (
  text: string
): Promise<boolean> => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        inputs: text,
        parameters: { candidate_labels: ["toxic", "non-toxic"] },
      },
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
      }
    );

    // Check the score of the "toxic" label directly
    const toxicScore = response.data.scores[response.data.labels.indexOf("toxic")];
    
    // If the score of "toxic" is above 0.7, consider it toxic
    return toxicScore > 0.7;
  } catch (error) {
    console.error("Error checking profanity with AI:", error);
    return false;
  }
};