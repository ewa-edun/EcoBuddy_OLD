import axios, { AxiosError } from 'axios';
import { GEMINI_API_KEY } from '../gemini/config'; // Fixed unterminated string literal

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'; 

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const getGeminiResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: userMessage
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 second timeout
      }
    );

    const data: GeminiResponse = response.data;
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response structure from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      console.error('Gemini API Error:', {
        status: axiosError.response.status,
        data: axiosError.response.data,
      });
    } else {
      console.error('Network/Connection Error:', axiosError.message);
    }
    
    throw new Error('Failed to get response from Gemini API');
  }
};