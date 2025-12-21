import { GoogleGenAI } from "@google/genai";
import { Transaction, Goal, Asset, ShoppingTrip } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFinances = async (
    transactions: Transaction[], 
    goals: Goal[], 
    assets: Asset[],
    shoppingTrips: ShoppingTrip[]
): Promise<string> => {
    const earnings = transactions.filter(t => t.type === 'INCOME');
    const expenses = transactions.filter(t => t.type === 'EXPENSE');
    
    const totalEarnings = earnings.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
    
    const pendingShoppingCost = shoppingTrips.reduce((acc, trip) => {
        const tripPending = trip.items
            .filter(item => !item.isBought)
            .reduce((sum, item) => sum + item.price, 0);
        return acc + tripPending;
    }, 0);

    const prompt = `
    Analyze the following financial snapshot for a personal finance app called Dohaeris.
    
    Data:
    - Monthly Earnings: $${totalEarnings.toFixed(2)}
    - Monthly Expenses: $${totalExpenses.toFixed(2)}
    - Total Assets (Patrimony): $${totalAssets.toFixed(2)}
    - Pending Shopping List Estimated Cost: $${pendingShoppingCost.toFixed(2)}
    - Active Goals: ${goals.map(g => `${g.name} (${Math.round((g.currentAmount/g.targetAmount)*100)}% complete)`).join(', ')}

    Please provide a concise, friendly, and motivating financial advice summary (max 3 short paragraphs). 
    Focus on:
    1. Cash flow health (Earnings vs Expenses).
    2. Progress towards goals.
    3. A specific tip based on the assets or shopping list.

    Keep the tone modern and professional yet accessible.
    `;

    try {
        // Use 'gemini-3-flash-preview' for summarization and analysis tasks as per guidelines.
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        // Accessing response.text as a property, which returns the extracted string output.
        return response.text || "Could not generate advice at this time.";
    } catch (error) {
        console.error("Error calling Gemini:", error);
        return "An error occurred while analyzing your finances. Please try again later.";
    }
};