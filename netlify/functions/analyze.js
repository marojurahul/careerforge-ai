exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const processDesc = body.process;
    const context = body.context;
    const industry = body.industry;

    const prompt = `You are a senior business analyst. Analyse the following process and produce a structured report with three sections.

CURRENT PROCESS:
${processDesc}
${context ? `\nCONTEXT / PAIN POINTS / GOALS:\n${context}` : ''}
${industry ? `\nINDUSTRY: ${industry}` : ''}

Produce your response in exactly this format:

AS-IS ANALYSIS:
[analysis here]

TO-BE RECOMMENDATIONS:
[recommendations here]

GAP ANALYSIS:
[gap analysis here]`;

    const apiKey = process.env.OPENAI_API_KEY;
    
    console.log("API Key exists:", !!apiKey);
    console.log("API Key prefix:", apiKey ? apiKey.substring(0, 7) : "none");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    console.log("OpenAI response status:", response.status);
    console.log("OpenAI data:", JSON.stringify(data).substring(0, 300));

    if (data.error) {
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ result: "OpenAI error: " + data.error.message })
      };
    }

    const text = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ result: text })
    };

  } catch (err) {
    console.log("Catch error:", err.message);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
};
