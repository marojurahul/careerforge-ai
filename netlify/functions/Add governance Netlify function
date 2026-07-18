exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const body = JSON.parse(event.body);
    const industry = body.industry;
    const risk = body.risk;

    const prompt = `You are a senior AI governance expert. Generate a detailed AI governance checklist for a ${risk} risk ${industry} AI project.

For each section, provide 5-7 specific, actionable checklist items tailored to ${industry} and ${risk} risk. Each item must end with a priority tag: [High], [Medium], or [Low].

Respond in EXACTLY this format:

DATA_PRIVACY:
- item text [High/Medium/Low]

BIAS_CHECKS:
- item text [High/Medium/Low]

HUMAN_OVERSIGHT:
- item text [High/Medium/Low]

REGULATORY:
- item text [High/Medium/Low]

AUDIT:
- item text [High/Medium/Low]

RISK_MITIGATION:
- item text [High/Medium/Low]

Be specific to ${industry} regulations (e.g. HIPAA, GDPR, FCA). Items must be concrete and testable.`;

    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1800,
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: data.error.message })
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
