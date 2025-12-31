import fs from "fs";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = "mr-rijal";
const README_PATH = "README.md";
const YEAR = 2026;

// Get start and end of 2026
const YEAR_START = `${YEAR}-01-01T00:00:00Z`;
const YEAR_END = `${YEAR}-12-31T23:59:59Z`;

async function fetchCommitsByDate() {
    try {
        console.log(`Fetching commit activity for ${USERNAME} in ${YEAR}...\n`);

        // Fetch user events
        const eventsUrl = `https://api.github.com/users/${USERNAME}/events/public?per_page=100`;
        const res = await fetch(eventsUrl, {
            headers: {
                Authorization: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : undefined,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (!res.ok) {
            console.warn(`Failed to fetch events: ${res.status} ${res.statusText}`);
            return {};
        }

        const events = await res.json();

        if (!Array.isArray(events)) {
            console.warn("No events data available");
            return {};
        }

        // Group commits by date
        const commitsByDate = {};
        const yearStart = new Date(YEAR_START);
        const yearEnd = new Date(YEAR_END);

        events.forEach(event => {
            if (event.type === "PushEvent") {
                const eventDate = new Date(event.created_at);

                // Only count events in 2026
                if (eventDate >= yearStart && eventDate <= yearEnd) {
                    const dateStr = eventDate.toISOString().split('T')[0];
                    const commitCount = event.payload?.commits?.length || 1;

                    if (!commitsByDate[dateStr]) {
                        commitsByDate[dateStr] = 0;
                    }
                    commitsByDate[dateStr] += commitCount;
                }
            }
        });

        return commitsByDate;
    } catch (error) {
        console.error(`Error fetching commits:`, error.message);
        return {};
    }
}

function getStatusEmoji(count) {
    if (count >= 10) return "🔥"; // On fire!
    if (count >= 5) return "✅";  // Great
    if (count >= 1) return "🟢";  // Good
    return "⚪"; // No commits
}

function generateCommitLog(commitsByDate) {
    const today = new Date();
    const yearStart = new Date(YEAR_START);

    let logEntries = [];

    // Get all dates from year start to today (or end of year, whichever is earlier)
    const endDate = today > new Date(YEAR_END) ? new Date(YEAR_END) : today;

    let currentDate = new Date(yearStart);
    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = commitsByDate[dateStr] || 0;
        const status = getStatusEmoji(count);

        logEntries.push({
            date: dateStr,
            count: count,
            status: status
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Reverse to show most recent first
    logEntries.reverse();

    // Limit to last 90 days for readability
    const recentEntries = logEntries.slice(0, 90);

    let md = "| Date | Commits | Status |\n";
    md += "|------|---------|--------|\n";

    if (recentEntries.length === 0) {
        md += "| No data yet | 0 | ⚪ |\n";
    } else {
        recentEntries.forEach(entry => {
            md += `| ${entry.date} | ${entry.count} | ${entry.status} |\n`;
        });
    }

    // Calculate statistics
    const totalCommits = Object.values(commitsByDate).reduce((sum, count) => sum + count, 0);
    const daysWithCommits = Object.keys(commitsByDate).length;
    const avgCommits = daysWithCommits > 0 ? (totalCommits / daysWithCommits).toFixed(1) : 0;

    md += `\n**2026 Stats:** ${totalCommits} total commits • ${daysWithCommits} active days • ${avgCommits} avg/day\n`;
    md += `\n*Legend: 🔥 10+ commits | ✅ 5-9 commits | 🟢 1-4 commits | ⚪ No commits*\n`;
    md += `*Showing last 90 days*`;

    return md;
}

async function updateCommitLog() {
    if (!GITHUB_TOKEN) {
        console.warn("⚠️  GITHUB_TOKEN not set. Using limited public data.\n");
    }

    const commitsByDate = await fetchCommitsByDate();
    const markdown = generateCommitLog(commitsByDate);

    // Read README
    let readme = fs.readFileSync(README_PATH, "utf-8");

    // Replace content between markers
    const newReadme = readme.replace(
        /<!-- COMMIT_LOG_START -->[\s\S]*?<!-- COMMIT_LOG_END -->/,
        `<!-- COMMIT_LOG_START -->\n${markdown}\n<!-- COMMIT_LOG_END -->`
    );

    fs.writeFileSync(README_PATH, newReadme);

    const totalCommits = Object.values(commitsByDate).reduce((sum, count) => sum + count, 0);
    console.log(`\n✅ Daily commit log updated!`);
    console.log(`   Found ${totalCommits} commits across ${Object.keys(commitsByDate).length} days\n`);
}

updateCommitLog().catch(error => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
});

