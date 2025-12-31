# Setup Guide

## Prerequisites

- Node.js 18+ (for native fetch support)
- GitHub account
- GitHub Personal Access Token (optional but recommended)

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

### GitHub Token (Recommended)

To avoid rate limiting, create a GitHub Personal Access Token:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "PR Tracker")
4. Select scopes: `public_repo` (for public repositories)
5. Generate and copy the token

### Local Usage

Run the script locally with your GitHub token:

```bash
export GITHUB_TOKEN=your_github_token_here
npm start
```

Or create a `.env` file (not committed):
```
GITHUB_TOKEN=your_github_token_here
```

## Available Scripts

The project includes several npm scripts:

- `npm start` - Runs all update scripts
- `npm run update:prs` - Updates PR tracking section only
- `npm run update:quarterly` - Updates quarterly progress table only
- `npm run update:commits` - Updates daily commit log only
- `npm run update:all` - Updates PRs, quarterly stats, and commit log
- `npm run status` - Shows summary report

## GitHub Actions Setup

The workflows are configured to run automatically:

- `update-profile.yml` - Updates PR tracking and quarterly stats daily at UTC 00:00
- `update-readme.yml` - Updates GitHub stats hourly

## Features

### 📈 Activity Heatmap
- Visual contribution graph showing daily activity
- GitHub streak statistics with current/longest streaks
- Overall GitHub stats with commit counts
- Top languages chart

### 📊 Quarterly Progress Tracker
- Automatically tracks progress toward quarterly goals
- Shows real-time commit and PR counts
- Status indicators:
  - ✅ Complete - Goal reached
  - 🟢 On Track - Meeting or exceeding expected progress
  - 🟡 Behind - 70-99% of expected progress
  - 🟠 Needs Effort - Started but below 70%
  - 🔴 Not Started - No activity yet
  - ⚪ Pending - Quarter hasn't started

### 🧩 PR Tracking
- Tracks PRs to Laravel and Tabler repositories
- Shows merge status (Merged/Open/Closed)
- Updates automatically via GitHub Actions

### 📅 Daily Commit Log
- Shows commit count for each day in 2026
- Displays last 90 days in list format
- Status indicators:
  - 🔥 10+ commits - On fire!
  - ✅ 5-9 commits - Great day
  - 🟢 1-4 commits - Good progress
  - ⚪ No commits - Rest day
- Statistics: Total commits, active days, daily average
- Updates automatically via GitHub Actions

### Required Secrets

Make sure your repository has the following secret configured:

1. Go to Repository Settings → Secrets and variables → Actions
2. Add `GITHUB_TOKEN` (automatically provided by GitHub Actions)

### Manual Trigger

You can manually trigger the workflows:

1. Go to Actions tab
2. Select the workflow
3. Click "Run workflow"

## Troubleshooting

### Service Unavailable (503 Error)

If you see "503: DEPLOYMENT_PAUSED" for stats images:
- The public GitHub stats service is temporarily down
- **Solution:** See `TROUBLESHOOTING.md` for alternative service URLs
- The README now uses a more reliable fork (Rickstaa's)
- Consider self-hosting for 100% uptime

### Script fails with "GITHUB_TOKEN not set"

- The script will still work but with limited API rate limits
- For better results, set the `GITHUB_TOKEN` environment variable

### No PRs showing up

- Make sure your username matches exactly (currently set to: `mr-rijal`)
- Check that you have PRs in the configured repositories (laravel/framework, tabler/tabler)
- PRs must be authored by you (not just mentioned)

### Workflow fails on GitHub

- Check the Actions tab for detailed error logs
- Ensure your repository has proper permissions
- Verify the workflow files are in `.github/workflows/`

### More Help

For detailed troubleshooting guides, see:
- `TROUBLESHOOTING.md` - Complete troubleshooting guide
- `FEATURES.md` - Feature documentation and customization

