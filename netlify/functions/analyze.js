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

Produce your response in exactly this format with these three section headers and nothing else before or after:

AS-IS ANALYSIS:
[Write a clear, structured analysis of the current process. Cover: key process steps, stakeholders involved, inputs and outputs, identified inefficiencies, bottlenecks, risks, and root causes of problems. Use plain numbered or bulleted points.]

TO-BE RECOMMENDATIONS:
[Write specific, actionable recommendations for the future state. Cover: redesigned process steps, technology or automation opportunities, how roles/responsibilities should change, expected benefits and outcomes. Be concrete and practical, not generic.]

GAP ANALYSIS:
[Identify the specific gaps between AS-IS and TO-BE. Cover: process gaps, technology gaps, skills/capability gaps, change management considerations, suggested priority order for addressing each gap.]`;

    const apiKey = process.env.OPENAI_API_KEY;

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
