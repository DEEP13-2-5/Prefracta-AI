import "dotenv/config";

const OPENROUTER_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";
console.log(`🤖 OpenRouter model configured: ${OPENROUTER_MODEL}`);

const getresponseopenrouter = async (messages) => {
  try {
    const apiKey =
      process.env.OPENROUTER_API_KEY ||
      process.env.OPENROUTER_KEY ||
      process.env.OpenRouter;
    const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    if (!apiKey) {
      throw new Error("OpenRouter API key missing. Set OPENROUTER_API_KEY on deployment environment.");
    }

    // Keep this as a list so a fallback can be added intentionally later.
    const freeModels = [
      OPENROUTER_MODEL,
    ];

    let lastError = null;

    // Try each model until one works
    for (const model of freeModels) {
      try {
        console.log(`🔄 Trying model: ${model}`);

        // Add 30-second timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey.trim()}`,
              "HTTP-Referer": appUrl,
              "X-Title": "Prefracta AI",
            },
            body: JSON.stringify({
              model: model,
              messages: messages,
              temperature: 0.3,
            }),
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);
        const data = await response.json();

        console.log(`📊 Model ${model} response status:`, response.status);

        if (response.ok) {
          const content = data?.choices?.[0]?.message?.content;
          if (content && content.trim().length > 0) {
            console.log(`✅ Success with model: ${model}`);
            return content;
          } else {
            console.warn(`⚠️ Model ${model} returned empty content`);
            lastError = "Empty response from model";
          }
        } else {
          console.warn(`⚠️ Model ${model} failed (${response.status}):`, data?.error?.message || response.statusText);
          lastError = data?.error?.message || response.statusText;
        }
      } catch (modelError) {
        console.warn(`⚠️ Model ${model} threw error:`, modelError.message);
        lastError = modelError.message;
        continue;
      }
    }

    // If all models failed
    console.error("❌ All OpenRouter models failed. Last error:", lastError);
    throw new Error(lastError || "All OpenRouter models failed");

  } catch (error) {
    console.error("❌ getresponseopenrouter Failed:", error);
    throw error;
  }
};

export default getresponseopenrouter;
