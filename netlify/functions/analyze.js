exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { process, context, industry } = JSON.parse(event.body);

    const prompt = `You are a senior business analyst. Analyse the following process and produce a structured report with three sections.

CURRENT PROCESS:
${process}
${context ? `\nCONTEXT / PAIN POINTS / GOALS:\n${context}` : ''}
${industry ? `\nINDUSTRY: ${industry}` : ''}

Produce your response in exactly this format with these three section headers and nothing else before or after:

AS-IS ANALYSIS:
[Write a clear, structured analysis of the current process. Cover: key process steps, stakeholders involved, inputs and outputs, identified inefficiencies, bottlenecks, risks, and root causes of problems. Use plain numbered or bulleted points.]

TO-BE RECOMMENDATIONS:
[Write specific, actionable recommendations for the future state. Cover: redesigned process steps, technology or automation opportunities, how roles/responsibilities should change, expected benefits and outcomes. Be concrete and practical, not generic.]

GAP ANALYSIS:
[Identify the specific gaps between AS-IS and TO-BE. Cover: process gaps, technology gaps, skills/capability gaps, change management considerations, suggested priority order for addressing each gap.]`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content.map(b => b.text || "").join("");

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
