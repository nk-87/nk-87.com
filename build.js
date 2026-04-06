const fs = require("fs");
const resume = JSON.parse(fs.readFileSync("resume.json", "utf8"));

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(d) {
  if (!d) return "Present";
  const [year, month] = d.split("-");
  return `${MONTHS[parseInt(month, 10) - 1]} ${year}`;
}

function dates(job) {
  return `${formatDate(job.start_date)} - ${formatDate(job.end_date)}`;
}

const jobs = resume.experience.map((job) => {
  const roles = job.roles.map((r) => `        <li>${r}</li>`).join("\n");
  return `    <div class="job">
      <div><a href="${job.company_url}">${job.company}</a></div>
      <div class="dates">${dates(job)}</div>
      <ul>
${roles}
      </ul>
    </div>`;
}).join("\n\n");

const schools = resume.education.map((edu) => {
  const degrees = edu.degrees
    .map((d) => `        <li>${d.type} ${d.subject}</li>`)
    .join("\n");
  return `    <div class="school">
      <div><a href="${edu.school_url}">${edu.school}</a></div>
      <ul>
${degrees}
      </ul>
    </div>`;
}).join("\n\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${resume.name}</title>
  <style>
    :root {
      color-scheme: light dark;
    }
    body {
      background-color: Canvas;
      color: CanvasText;
      font-family: monospace;
      font-size: 16px;
      margin: 0;
      padding: 2em;
    }
    a:link, a:visited {
      color: LinkText;
    }
    h1, h2 {
      font-size: inherit;
      font-weight: normal;
      margin: 0;
    }
    h1 {
      margin-bottom: 1.5em;
    }
    h2 {
      margin-bottom: 0.5em;
      text-transform: uppercase;
    }
    section {
      margin-bottom: 1.5em;
    }
    .job, .school {
      margin-bottom: 1em;
    }
    .dates {
      opacity: 0.7;
    }
    ul {
      list-style: none;
      margin: 0;
      padding-left: 1em;
    }
    ul li::before {
      content: "- ";
      margin-left: -1em;
    }
    @media (max-width: 480px) {
      .separator {
        display: none;
      }
      .title {
        display: block;
      }
    }
  </style>
</head>
<body>
  <h1><span class="name">${resume.name}</span> <span class="separator">/ </span><span class="title">${resume.title}</span></h1>

  <section>
    <h2>Experience</h2>

${jobs}
  </section>

  <section>
    <h2>Education</h2>

${schools}
  </section>
</body>
</html>`;

fs.mkdirSync("_site", { recursive: true });
fs.writeFileSync("_site/index.html", html);
fs.copyFileSync("resume.json", "_site/resume.json");
console.log("Built _site/index.html and _site/resume.json");
