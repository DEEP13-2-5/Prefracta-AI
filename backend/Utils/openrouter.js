import "dotenv/config";

const getresponseopenrouter = async (messages) => {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "xiaomi/mimo-v2-flash:free",
          messages: messages,
        }),
      }
    );

    const data = await response.json();

    // Detailed logging for debugging
    if (!response.ok) {
      console.error("❌ OpenRouter HTTP Error:", response.status, response.statusText);
      console.error("❌ Response Body:", JSON.stringify(data, null, 2));
    }

    if (!data?.choices?.[0]?.message?.content) {
      console.warn("⚠️ OpenRouter returned empty/invalid response:", JSON.stringify(data, null, 2));
    }

    return data?.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("❌ getresponseopenrouter Failed:", error);
    return null; // handled safely by frontend
  }
};

export default getresponseopenrouter;

