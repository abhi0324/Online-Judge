import {GoogleGenAI} from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({apiKey : process.env.GEMINI_API_KEY});
export async function runGemini(code){
    try{
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are the assistant that reviews code and provide feedback.
            Here is the code
            ${code}
            Please provide detailed review of code, including any errors or issues, and suggestion for improvements.
            `,
          });
          
        //   console.log(response.text);
          return response.text;
    }
    catch(error){
        console.error('Gemini API Error', error);
        return 'Error while calling Gemini API';
    }
}