import fs from "fs";
import { execSync } from "child_process";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = "mr-rijal";
const REPO = "mr-rijal/mr-rijal";
const README_PATH = "README.md";
const YEAR = 2026;

async function fetchRepoStats() {
    try {
        const url = `https://api.github.com/repos/${REPO}`;
        const res = await fetch(url, {
            headers: {
                Authorization: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : undefined,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (!res.ok) {
            console.warn(`Failed to fetch repo stats: ${res.status}`);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error(`Error fetching repo stats:`, error.message);
        return null;
    }
}

async function countCommitsInYear() {
    try {
        // Count commits from user events (across all repos)
        const yearStart = `${YEAR}-01-01T00:00:00Z`;
        const yearEnd = `${YEAR}-12-31T23:59:59Z`;

        let totalCommits = 0;
        let page = 1;
        const perPage = 100;

        while (true) {
            const url = `https://api.github.com/users/${USERNAME}/events/public?per_page=${perPage}&page=${page}`;

            const res = await fetch(url, {
                headers: {
                    Authorization: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : undefined,
                    Accept: "application/vnd.github.v3+json",
                },
            });

            if (!res.ok) {
                console.warn(`Failed to fetch events: ${res.status}`);
                break;
            }

            const events = await res.json();

            if (!Array.isArray(events) || events.length === 0) {
                break;
            }

            // Filter PushEvents in 2026 and count commits
            const yearStartDate = new Date(yearStart);
            const yearEndDate = new Date(yearEnd);

            events.forEach(event => {
                if (event.type === "PushEvent") {
                    const eventDate = new Date(event.created_at);
                    if (eventDate >= yearStartDate && eventDate <= yearEndDate) {
                        totalCommits += event.payload?.commits?.length || 1;
                    }
                }
            });

            // Check if we've gone past the year
            const oldestEvent = events[events.length - 1];
            if (oldestEvent && new Date(oldestEvent.created_at) < yearStartDate) {
                break;
            }

            page++;

            // Safety limit
            if (page > 10) break;
        }

        return totalCommits;
    } catch (error) {
        console.error(`Error counting commits:`, error.message);
        return 0;
    }
}

async function updateStatsBadges() {
    console.log("Fetching GitHub statistics...\n");

    const repoStats = await fetchRepoStats();
    const totalCommits = await countCommitsInYear();

    if (!repoStats) {
        console.warn("⚠️  Could not fetch stats. README will remain unchanged.");
        return;
    }

    // Read README
    let readme = fs.readFileSync(README_PATH, "utf-8");

    // Update the commit count badge
    // Format: ![Commits Badge](https://img.shields.io/badge/Commits-0/365-brightgreen)
    const commitCount = totalCommits || 0;
    const commitBadgeUrl = `https://img.shields.io/badge/Commits-${commitCount}/365-brightgreen`;

    // Update badge URL - match the exact pattern
    readme = readme.replace(
        /!\[Commits Badge\]\(https:\/\/img\.shields\.io\/badge\/Commits-\d+\/365-[^)]+\)/g,
        `![Commits Badge](${commitBadgeUrl})`
    );

    // Update stars count if needed
    const stars = repoStats.stargazers_count || 0;

    console.log("✅ Stats fetched successfully");
    console.log(`   Total commits in ${YEAR}: ${commitCount}`);
    console.log(`   Repository stars: ${stars}`);
    console.log(`   Repository forks: ${repoStats.forks_count || 0}\n`);

    // Write back
    fs.writeFileSync(README_PATH, readme);
    console.log("✅ README stats badges updated!");
    console.log(`   Updated commit count badge to: ${commitCount}/365`);
}

if (!GITHUB_TOKEN) {
    console.warn("⚠️  GITHUB_TOKEN not set. Using limited public data.\n");
}

updateStatsBadges().catch(error => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
});

