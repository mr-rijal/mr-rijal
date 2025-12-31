import fs from "fs";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = "mr-rijal";
const README_PATH = "README.md";

// Define quarters for 2026
const QUARTERS = [
    { name: "Q1 (Jan-Mar)", start: "2026-01-01", end: "2026-03-31", targetCommits: 900, targetPRs: 91 },
    { name: "Q2 (Apr-Jun)", start: "2026-04-01", end: "2026-06-30", targetCommits: 910, targetPRs: 91 },
    { name: "Q3 (Jul-Sep)", start: "2026-07-01", end: "2026-09-30", targetCommits: 920, targetPRs: 91 },
    { name: "Q4 (Oct-Dec)", start: "2026-10-01", end: "2026-12-31", targetCommits: 920, targetPRs: 92 },
];

async function fetchUserStats(since, until) {
    try {
        // Fetch user events
        const eventsUrl = `https://api.github.com/users/${USERNAME}/events?per_page=100`;
        const res = await fetch(eventsUrl, {
            headers: {
                Authorization: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : undefined,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (!res.ok) {
            console.warn(`Failed to fetch events: ${res.status}`);
            return { commits: 0, prs: 0 };
        }

        const events = await res.json();

        if (!Array.isArray(events)) {
            return { commits: 0, prs: 0 };
        }

        // Filter events by date range
        const sinceDate = new Date(since);
        const untilDate = new Date(until);

        const filteredEvents = events.filter(event => {
            const eventDate = new Date(event.created_at);
            return eventDate >= sinceDate && eventDate <= untilDate;
        });

        // Count commits and PRs
        const commits = filteredEvents.filter(e => e.type === "PushEvent").length;
        const prs = filteredEvents.filter(e => e.type === "PullRequestEvent").length;

        return { commits, prs };
    } catch (error) {
        console.error(`Error fetching stats:`, error.message);
        return { commits: 0, prs: 0 };
    }
}

function getQuarterStatus(actual, target) {
    const now = new Date();
    const percentage = (actual / target) * 100;

    if (percentage >= 100) return "✅ Complete";
    if (percentage >= 75) return "🟢 On Track";
    if (percentage >= 50) return "🟡 Behind";
    if (percentage > 0) return "🟠 Started";

    // Check if quarter has started
    return "⚪ Pending";
}

async function updateQuarterlyProgress() {
    console.log("Fetching quarterly statistics...\n");

    const currentDate = new Date();
    console.log(`Current date: ${currentDate.toISOString().split('T')[0]}`);

    let tableRows = "";

    for (const quarter of QUARTERS) {
        const quarterStart = new Date(quarter.start);
        const quarterEnd = new Date(quarter.end);
        quarterEnd.setHours(23, 59, 59, 999); // Set to end of day

        // Determine if this quarter is current, past, or future
        let status;
        let stats = { commits: 0, prs: 0 };

        if (currentDate < quarterStart) {
            status = "⚪ Pending";
        } else if (currentDate > quarterEnd) {
            // Past quarter - fetch real stats
            stats = await fetchUserStats(quarter.start, quarter.end);
            const actualStatus = getQuarterStatus(stats.commits, quarter.targetCommits);
            status = actualStatus;
        } else {
            // Current quarter - fetch stats from start to now
            const today = currentDate.toISOString().split('T')[0];
            stats = await fetchUserStats(quarter.start, today);

            // Calculate progress percentage
            const daysInQuarter = Math.ceil((quarterEnd - quarterStart) / (1000 * 60 * 60 * 24));
            const daysPassed = Math.ceil((currentDate - quarterStart) / (1000 * 60 * 60 * 24));
            const expectedCommits = Math.floor((quarter.targetCommits * daysPassed) / daysInQuarter);

            if (stats.commits >= expectedCommits) {
                status = "🟢 On Track";
            } else if (stats.commits >= expectedCommits * 0.7) {
                status = "🟡 Behind";
            } else if (stats.commits > 0) {
                status = "🟠 Needs Effort";
            } else {
                status = "🔴 Not Started";
            }
        }

        const commitProgress = stats.commits > 0 ? ` (${stats.commits}/${quarter.targetCommits})` : "";
        const prProgress = stats.prs > 0 ? ` (${stats.prs}/${quarter.targetPRs})` : "";

        tableRows += `| ${quarter.name} | ${quarter.targetCommits}${commitProgress} | ${quarter.targetPRs}${prProgress} | ${status} |\n`;

        console.log(`${quarter.name}: ${stats.commits} commits, ${stats.prs} PRs - ${status}`);
    }

    const newTable = `| Quarter | Target Commits | Target PRs | Status |
|---------|---------------|------------|--------|
${tableRows}`;

    // Read README
    let readme = fs.readFileSync(README_PATH, "utf-8");

    // Replace the quarterly table
    const tableRegex = /\| Quarter \| Target Commits[\s\S]*?\*\*Total Goal:\*\*/;
    const replacement = `${newTable}\n**Total Goal:**`;

    const newReadme = readme.replace(tableRegex, replacement);

    fs.writeFileSync(README_PATH, newReadme);
    console.log("\n✅ Quarterly progress table updated!");
}

if (!GITHUB_TOKEN) {
    console.warn("⚠️  GITHUB_TOKEN not set. Stats will be estimated.\n");
}

updateQuarterlyProgress().catch(error => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
});

