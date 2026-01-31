import "dotenv/config";

const getresponseopenrouter = async (messages) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("❌ OPENROUTER_API_KEY is missing from environment variables!");
      return null;
    }

    // List of free models to try in order (Solar Pro first as requested)
    const freeModels = [
      "upstage/solar-pro-3:free",
      "meta-llama/llama-3.2-3b-instruct:free",
      "qwen/qwen-2-7b-instruct:free",
      "google/gemma-2-9b-it:free",
      "nousresearch/hermes-3-llama-3.1-405b:free",
      "mistralai/mistral-7b-instruct:free"
    ];

    let lastError = null;

    // Try each model until one works
    for (const model of freeModels) {
      try {
        // console.log(`🔄 Trying model: ${model}`);

        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey.trim()}`,
            },
            body: JSON.stringify({
              model: model,
              messages: messages,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          const content = data?.choices?.[0]?.message?.content;
          if (content && content.trim().length > 0) {
            console.log(`✅ Success with model: ${model}`);
            return content;
          }
        } else {
          console.warn(`⚠️ Model ${model} failed:`, data?.error?.message || response.statusText);
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
    return null;

  } catch (error) {
    console.error("❌ getresponseopenrouter Failed:", error);
    return null;
  }
};

export default getresponseopenrouter;

