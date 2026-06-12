/* =========================================
   ATS Keyword Match Scanner
   Compares a resume against a job description
   and reports keyword overlap + a match score.
   ========================================= */

// Common English stopwords to ignore when extracting keywords
const STOPWORDS = new Set([
  "the","and","for","with","that","this","from","your","you","are","will",
  "have","has","our","their","they","them","his","her","its","be","is",
  "was","were","been","being","to","of","in","on","at","by","an","a",
  "as","or","if","it","we","us","i","but","not","can","all","any","other",
  "than","then","so","such","into","about","over","under","more","most",
  "some","also","each","per","via","across","including","etc","including",
  "who","what","when","where","why","how","do","does","did","done",
  "should","would","could","may","might","must","shall","up","down","out",
  "off","again","further","once","here","there","both","few","because",
  "while","after","before","between","through","during","above","below"
]);

function extractKeywords(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+./\s-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));

  // Count frequency
  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  // Sort by frequency, return top terms
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
}

function runScan() {
  const jdText = document.getElementById("jd-input").value.trim();
  const resumeText = document.getElementById("resume-input").value.trim();
  const resultBox = document.getElementById("scan-result");

  if (!jdText || !resumeText) {
    resultBox.classList.add("show");
    resultBox.innerHTML = `<p style="font-family: var(--font-mono); font-size: 0.85rem; color: #C2553B;">Paste both the job description and your resume text to run a scan.</p>`;
    return;
  }

  const jdKeywords = extractKeywords(jdText).slice(0, 25);
  const resumeWords = new Set(extractKeywords(resumeText));

  const matched = jdKeywords.filter(k => resumeWords.has(k));
  const missing = jdKeywords.filter(k => !resumeWords.has(k));

  const score = Math.round((matched.length / jdKeywords.length) * 100);

  let scoreClass = "low";
  let scoreLabel = "Needs work";
  if (score >= 70) { scoreClass = ""; scoreLabel = "Strong match"; }
  else if (score >= 40) { scoreClass = "mid"; scoreLabel = "Moderate match"; }
  else { scoreLabel = "Low match"; }

  resultBox.classList.add("show");
  resultBox.innerHTML = `
    <div style="display:flex; align-items:baseline; gap:14px; margin-bottom: 4px;">
      <span class="score-circle ${scoreClass}">${score}%</span>
      <span style="font-family: var(--font-mono); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--charcoal);">${scoreLabel}</span>
    </div>
    <p style="font-size: 0.85rem; color: #555; margin: 10px 0 14px;">
      ${matched.length} of ${jdKeywords.length} top job-description terms appear in your resume.
    </p>
    <div style="margin-bottom: 10px;">
      <label style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--teal); display:block; margin-bottom:6px;">Matched terms</label>
      <div class="match-list">
        ${matched.length ? matched.map(k => `<span class="tag matched">${k}</span>`).join("") : '<span style="font-size:0.8rem; color:#999;">None found</span>'}
      </div>
    </div>
    <div>
      <label style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #C2553B; display:block; margin-bottom:6px;">Consider adding</label>
      <div class="match-list">
        ${missing.length ? missing.slice(0, 12).map(k => `<span class="tag missing">${k}</span>`).join("") : '<span style="font-size:0.8rem; color:#999;">Great coverage!</span>'}
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("scan-btn");
  if (btn) btn.addEventListener("click", runScan);
});
