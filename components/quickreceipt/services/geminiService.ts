// import { GoogleGenAI } from "@google/genai";
// import { ReceiptData } from "../../../types";

// const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// if (!apiKey) {
//   throw new Error("VITE_GEMINI_API_KEY is missing");
// }

// const ai = new GoogleGenAI({ apiKey });

// export const generateReceiptNote = async (
//   data: ReceiptData
// ): Promise<string> => {
//   try {
//     const modelId = "gemini-2.5-flash";

//     const itemsSummary = data.items
//       .map(item => `${item.description} (${data.currency} ${item.amount})`)
//       .join(", ");

//     const prompt = `
// Write a short, professional, and polite footer note for a receipt/invoice.
// Company: ${data.companyName}
// Customer: ${data.customerName}
// Total: ${data.currency} ${data.totalAmount}
// Services: ${itemsSummary}
// Date: ${data.date}

// 1–2 sentences only. Thank the customer.
// `;

//     const response = await ai.models.generateContent({
//       model: modelId,
//       contents: prompt,
//     });

//     return response.text.trim();
//   } catch (error) {
//     console.error("Gemini error:", error);
//     return "Thank you for your valued business. We look forward to serving you again.";
//   }
// };
