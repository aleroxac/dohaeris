import { GoogleGenAI } from "@google/genai";
import { Transaction, Goal, Asset, ShoppingTrip } from "../types";

// Safe access to process.env
const getApiKey = () => {
    try {
        if (typeof process !== 'undefined' && process.env) {
            return process.env.API_KEY || '';
        }
    } catch (e) {
        // Ignore errors if process is not defined
    }
    return '';
};

const apiKey = getApiKey();

// Initialize safe client
let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

export const analyzeFinances = async (
    transactions: Transaction[], 
    goals: Goal[], 
    assets: Asset[],
    shoppingTrips: ShoppingTrip[]
): Promise<string> => {
    if (!ai) {
        return "API Key not configured. Please check your environment variables.";
    }

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
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Could not generate advice at this time.";
    } catch (error) {
        console.error("Error calling Gemini:", error);
        return "An error occurred while analyzing your finances. Please try again later.";
    }
};