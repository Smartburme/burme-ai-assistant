export default {
  async scheduled(event, env, ctx) {
    // CRON handler
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // favicon.ico ကို empty response ပေးတာ (သို့မဟုတ်) တကယ်ဖိုင် serve လုပ်လို့ရမယ်
    if (request.method === "GET" && url.pathname === "/favicon.ico") {
      return new Response(null, { status: 204 });  // empty response with No Content
    }

    // POST request များကိုသာ handle
    if (request.method === "POST") {
      try {
        const { message } = await request.json();

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
          }
        );

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Method Not Allowed", { status: 405 });
  },
};
