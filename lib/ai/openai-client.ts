import OpenAI from "openai";

const globalForOpenAI = globalThis as unknown as { openai?: OpenAI };

export const openaiModel = process.env.OPENAI_MODEL || "gpt-5.2";

export class AIProviderError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AIProviderError";
    this.status = status;
  }
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AIProviderError("OPENAI_API_KEY is not configured.", 500);
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
  try {
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
      throw new AIProviderError("The AI provider returned an empty response.", 502);
    }

    return text;
  } catch (error) {
    if (error instanceof AIProviderError) {
      throw error;
    }

    if (error instanceof OpenAI.APIError) {
      const message = error.message || "OpenAI request failed.";
      throw new AIProviderError(`OpenAI error: ${message}`, error.status);
    }

    throw new AIProviderError(
      error instanceof Error ? error.message : "AI provider request failed.",
      500
    );
  }
}
