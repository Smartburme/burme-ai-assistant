export default {
  async scheduled(event, env, ctx) {
    console.log("CRON job run at", new Date(event.scheduledTime).toISOString());
    // ဒီမှာ CRON job အတွက် လုပ်ဆောင်ချက်တွေ ထည့်ပါ
    // ဥပမာ - DB cleanup, cache refresh စသည်
  },

  async fetch(request, env) {
    try {
      if (request.method === "POST") {
        const { message } = await request.json();

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: message }] }],
            }),
          }
        );

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      return new Response("Method Not Allowed", { status: 405 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};
