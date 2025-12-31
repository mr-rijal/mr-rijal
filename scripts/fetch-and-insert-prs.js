import fs from "fs";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = "mr-rijal";
const README_PATH = "README.md";
const REPOS = ["laravel/framework", "tabler/tabler"];

async function fetchPRs(repo) {
  const url = `https://api.github.com/repos/${repo}/pulls?state=all&per_page=100`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : undefined,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch PRs from ${repo}: ${res.status} ${res.statusText}`);
      const errorBody = await res.text();
      console.error(`Error details: ${errorBody}`);
      return [];
    }

    const prs = await res.json();

    if (!Array.isArray(prs)) {
      console.error(`Expected array from API, got:`, prs);
      return [];
    }

    const userPRs = prs
      .filter(pr => pr.user.login.toLowerCase() === USERNAME.toLowerCase())
      .map(pr => ({
        title: pr.title,
        url: pr.html_url,
        state: pr.state,
        merged: pr.merged_at ? true : false
      }));

    console.log(`Found ${userPRs.length} PRs for ${USERNAME} in ${repo}`);
    return userPRs;
  } catch (error) {
    console.error(`Error fetching PRs from ${repo}:`, error.message);
    return [];
  }
}

function generateMarkdown(prsData) {
  let md = "\n### Laravel MRs\n| # | PR | Status |\n|---|----|--------|\n";
  prsData.find(r => r.repo === "laravel/framework")?.prs.forEach((pr, i) => {
    const status = pr.merged ? "Merged" : pr.state === "closed" ? "Closed" : "Open";
    md += `| ${i + 1} | ${pr.title} | ${status} |\n`;
  });

  md += "\n### Tabler MRs\n| # | PR | Status |\n|---|----|--------|\n";
  prsData.find(r => r.repo === "tabler/tabler")?.prs.forEach((pr, i) => {
    const status = pr.merged ? "Merged" : pr.state === "closed" ? "Closed" : "Open";
    md += `| ${i + 1} | ${pr.title} | ${status} |\n`;
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
  if (!GITHUB_TOKEN) {
    console.warn("⚠️  GITHUB_TOKEN not set. API rate limits will be severely restricted.");
    console.warn("   Set GITHUB_TOKEN environment variable for better results.");
    console.warn("   Example: export GITHUB_TOKEN=your_github_token_here\n");
  }

  console.log(`Fetching PRs for user: ${USERNAME}`);
  console.log(`Repositories: ${REPOS.join(", ")}\n`);

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
  console.log("✅ README.md PR section updated!");
}

main().catch(error => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
