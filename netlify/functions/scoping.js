exports.handler = async function(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const projectDescription = body.projectDescription;
    const expectedValue      = body.expectedValue;
    const scalingSteps       = body.scalingSteps;
    const apiKey             = process.env.OPENAI_API_KEY;

    if (!projectDescription) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "projectDescription is required." })
      };
    }

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "API key not configured." })
      };
    }

    const valueLine   = expectedValue  ? `Expected value / business goal: ${expectedValue}`  : "";
    const scalingLine = scalingSteps   ? `Scaling context / constraints: ${scalingSteps}`    : "";

    const prompt = `You are a senior AI strategy consultant and business analyst. A BA has submitted an AI project for evaluation. Analyse it thoroughly and return your findings in exactly the 5 sections below, using the exact headers shown.

PROJECT DETAILS:
${projectDescription}
${valueLine}
${scalingLine}

Produce your response in this exact format — use the headers exactly as written, followed by your content:

PROJECT VALIDATION:
Assess whether this is a strong AI use case. Explain what makes it suitable (or not) for AI, what type of AI would be applied (e.g. NLP, ML classification, generative AI, computer vision), and give an overall feasibility rating: Low / Medium / High. Be specific to the project described.

VALUE ASSESSMENT:
Provide a realistic ROI and time-savings estimate. Include: estimated time saved per week or month, potential cost reduction or revenue uplift (with rough figures where possible), payback period estimate, and a confidence level (Low / Medium / High) with brief justification. Base estimates on typical industry benchmarks.

RISKS AND CONS:
List at least 3 specific risks or downsides for this project. For each risk include: the risk name, a description of why it applies to this specific project, and a suggested mitigation. Format each as a numbered item.

SCALING ROADMAP:
Describe a 4-phase roadmap from pilot to full production. For each phase include: phase name, duration estimate, key activities, success criteria to exit the phase, and team/resource requirements. Make it specific to the project described.

SUCCESS METRICS:
List exactly 5 specific, measurable KPIs to track the success of this AI project. For each KPI include: the metric name, how it is measured, the target value or threshold, and the measurement frequency. Make KPIs relevant to the stated expected value.`;

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
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
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
