exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const processDesc = body.process;
    const context = body.context;
    const industry = body.industry;
    const apiKey = process.env.OPENAI_API_KEY;

    const prompt = `You are a senior business analyst. Analyse the following process and produce a structured report.

CURRENT PROCESS:
${processDesc}
${context ? `\nCONTEXT / PAIN POINTS / GOALS:\n${context}` : ''}
${industry ? `\nINDUSTRY: ${industry}` : ''}

Respond using EXACTLY these three headers and no other text:

AS-IS ANALYSIS:
(write 4-6 bullet points analysing the current state, inefficiencies, bottlenecks, and root causes)

TO-BE RECOMMENDATIONS:
(write 4-6 bullet points describing the improved future state with specific actions and technology suggestions)

GAP ANALYSIS:
(write 4-6 bullet points identifying gaps between current and future state including process, technology, and skills gaps)`;

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

    if (data.error) {
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ result: "API Error: " + data.error.message })
      };
    }

    const text = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ result: text })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
};
