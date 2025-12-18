import fetch from "node-fetch";
import fs from "fs";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = "mr-rijal";
const README_PATH = "README.md";
const REPOS = ["laravel/framework", "tabler/tabler"];

async function fetchPRs(repo) {
  const url = `https://api.github.com/repos/${repo}/pulls?state=all&per_page=100`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  const prs = await res.json();
  return prs
    .filter(pr => pr.user.login.toLowerCase() === USERNAME.toLowerCase())
    .map(pr => ({
      title: pr.title,
      url: pr.html_url,
      state: pr.state,
      merged: pr.merged_at ? true : false
    }));
}

function generateMarkdown(prsData) {
  let md = "\n### Laravel MRs\n| # | PR | Status |\n|---|----|--------|\n";
  prsData.find(r => r.repo === "laravel/framework")?.prs.forEach((pr, i) => {
    const status = pr.merged ? "Merged" : pr.state === "closed" ? "Closed" : "Open";
    md += `| ${i+1} | ${pr.title} | ${status} |\n`;
  });

  md += "\n### Tabler MRs\n| # | PR | Status |\n|---|----|--------|\n";
  prsData.find(r => r.repo === "tabler/tabler")?.prs.forEach((pr, i) => {
    const status = pr.merged ? "Merged" : pr.state === "closed" ? "Closed" : "Open";
    md += `| ${i+1} | ${pr.title} | ${status} |\n`;
  });

  // Keep packages static
  md += `
### Packages
| # | Name | Status |
|---|------|--------|
| 1 | laravel-sms-gateway | [ ] |
| 2 | laravel-payment-gateway | [ ] |
| 3 | laravel-auth-extension | [ ] |
`;
  return md;
}

async function main() {
  let allPRs = [];
  for (const repo of REPOS) {
    const prs = await fetchPRs(repo);
    allPRs.push({ repo, prs });
  }

  const markdown = generateMarkdown(allPRs);

  // Read README
  let readme = fs.readFileSync(README_PATH, "utf-8");

  // Replace content between markers
  const newReadme = readme.replace(
    /<!-- PR_TRACKER_START -->[\s\S]*<!-- PR_TRACKER_END -->/,
    `<!-- PR_TRACKER_START -->${markdown}<!-- PR_TRACKER_END -->`
  );

  fs.writeFileSync(README_PATH, newReadme);
  console.log("README.md PR section updated!");
}

main();
