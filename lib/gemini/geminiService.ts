import axios, { AxiosError } from 'axios';
import { GEMINI_API_KEY } from '../gemini/config'; // Fixed unterminated string literal

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'; 

interface GeminiResponse {
  candidates: Array<{
    content: string;
  }>;
}

export const getGeminiResponse = async (userMessage: string): Promise<any>  => {
  try {
    const response = await axios.post(
      `${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: userMessage
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000 // Increased for quiz questions
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000 // 15 second timeout
      }
    );

    const data = response.data;
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response structure from Gemini API');
    }

    // Extract the text content
    const responseText = data.candidates[0].content.parts[0].text;

    // Try to parse as JSON, otherwise return as text
    try {
      const parsed = JSON.parse(responseText);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [responseText];
    } catch {
      return [responseText];
    }

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