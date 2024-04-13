import openAIClient from "../lib/open-ai";

const SYSTEM_PROMPT = `I am building a Voice-enabled Inventory Management System.

You are the smart-bot that powers it. You'll be provided with the transcription of the voice - you need to extract the products and their respective quantity from it.

Remember it's a shopkeeper, with very low digital literacy and some words may not make sense, but it's your job to assign the closest product making sense to it (if found).

If the price of a product is not provided, you can assume it to be 0.

O/P JSON Format:
{
    [productName]: {
        price: number;
        quantity: number;
    }
}`;

export default async function extractInventoryFromTranslation(inventoryTranslation: string) {
  const inventoryResponse = await openAIClient.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: inventoryTranslation },
    ],
    temperature: 0.2,
    max_tokens: 1024,
    response_format: { type: "json_object" },
  });

  try {
    if (!inventoryResponse.choices[0].message.content) {
      throw new Error("Failed To Extract Inventory From Translation");
    }

    const inventory = JSON.parse(inventoryResponse.choices[0].message.content);
    return inventory;
  } catch (error) {
    console.error(`error: ${error}`);
    throw new Error("Failed To Extract Inventory From Translation");
  }
}
