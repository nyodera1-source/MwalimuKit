import OpenAI from "openai";

const globalForOpenAI = globalThis as unknown as { openai?: OpenAI };

export const openaiModel = process.env.OPENAI_MODEL || "gpt-5.2";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (!globalForOpenAI.openai) {
    globalForOpenAI.openai = new OpenAI({ apiKey });
  }

  return globalForOpenAI.openai;
}

interface GenerateAITextInput {
  systemPrompt: string;
  userPrompt: string;
  maxOutputTokens?: number;
  model?: string;
}

export async function generateAIText({
  systemPrompt,
  userPrompt,
  maxOutputTokens = 4096,
  model = openaiModel,
}: GenerateAITextInput): Promise<string> {
  const openai = getOpenAIClient();
  const response = await openai.responses.create({
    model,
    max_output_tokens: maxOutputTokens,
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const text = response.output_text?.trim();
  if (!text) {
    throw new Error("No text response from AI provider");
  }

  return text;
}
