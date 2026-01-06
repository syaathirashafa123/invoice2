
import { GoogleGenAI } from "@google/genai";

export const generateSmartDescription = async (itemName: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a brief, professional, 1-sentence business description for an invoice line item called "${itemName}". Keep it concise.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Professional service delivery.";
  }
};

export const generateInvoiceEmailDraft = async (invoiceData: any, clientName: string, status: string): Promise<{ subject: string; body: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `As a professional billing assistant for "Nova Solutions", write a professional email draft for an invoice.
    Details:
    - Client: ${clientName}
    - Invoice Number: ${invoiceData.invoiceNumber}
    - Amount: $${invoiceData.total}
    - Due Date: ${invoiceData.dueDate}
    - Status: ${status}

    Provide the output in JSON format with "subject" and "body" keys. 
    If status is Paid, make it a thank you note. 
    If status is Overdue, make it a firm but polite reminder.
    If status is Draft/Sent, make it a professional delivery of the document.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const result = JSON.parse(response.text || '{"subject": "", "body": ""}');
    return {
      subject: result.subject || `Invoice ${invoiceData.invoiceNumber} from Nova Solutions`,
      body: result.body || `Hi ${clientName},\n\nPlease find your invoice ${invoiceData.invoiceNumber} attached.\n\nTotal: $${invoiceData.total}\nDue: ${invoiceData.dueDate}`
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      subject: `Invoice ${invoiceData.invoiceNumber} from Nova Solutions`,
      body: `Hi ${clientName},\n\nPlease find your invoice ${invoiceData.invoiceNumber} attached for $${invoiceData.total}.`
    };
  }
};
