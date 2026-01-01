# 📈 2026 Activity Heatmap Features

Your GitHub profile now includes comprehensive tracking and visualization!

## 🎨 What's New

### 1. **GitHub Activity Heatmap** 🔥
A beautiful activity graph showing your daily contributions throughout 2026.

**Location:** Right after "Real-time Stats" in README.md

**Features:**
- Full-year contribution visualization
- Dark theme matching your profile
- Auto-updates with every commit

**Powered by:** github-readme-activity-graph.vercel.app

---

### 2. **Streak Statistics** 📅
Track your current and longest contribution streaks.

**Shows:**
- Current streak (consecutive days)
- Longest streak
- Total contributions

**Powered by:** github-readme-streak-stats.herokuapp.com

---

### 3. **GitHub Stats Card** 📊
Comprehensive statistics about your GitHub activity.

**Includes:**
- Total stars earned
- Total commits (2026)
- Total PRs
- Total issues
- Contributions by repository

**Powered by:** github-readme-stats.vercel.app

---

### 4. **Top Languages Chart** 💻
Visual breakdown of your most-used programming languages.

**Features:**
- Compact layout
- Shows top 8 languages
- Percentage breakdown
- Auto-updates with contributions

---

### 5. **Quarterly Progress Tracker** 🎯

Interactive table showing progress toward quarterly goals.

---

### 6. **Star History Chart** ⭐

Visual timeline showing how your repository gains stars over time.

**Features:**
- Beautiful growth chart
- Date-based timeline
- Clickable for detailed view
- Auto-updates with new stars

**Powered by:** star-history.com

**Shows:**
- Total stars over time
- Growth trajectory
- Community interest
- Project momentum

---

### 7. **Daily Commit Log** 📅

A chronological list showing your daily commit count throughout 2026.

**Format:**
```
| Date       | Commits | Status |
|------------|---------|--------|
| 2026-01-15 | 12      | 🔥     |
| 2026-01-14 | 7       | ✅     |
| 2026-01-13 | 3       | 🟢     |
```

**Status Indicators:**
- 🔥 **10+ commits** - On fire! Crushing it!
- ✅ **5-9 commits** - Great day, solid progress
- 🟢 **1-4 commits** - Good, keeping the streak
- ⚪ **0 commits** - Rest day

**Features:**
- Shows last 90 days (most recent first)
- Daily commit count per date
- Statistics summary at bottom:
  - Total commits in 2026
  - Number of active days
  - Average commits per day
- Updates daily via GitHub Actions

**Updates:** Automatically every day at 00:00 UTC

---

**Status Indicators:**
- ✅ **Complete** - Goal reached (100%+)
- 🟢 **On Track** - Meeting/exceeding expected progress
- 🟡 **Behind** - 70-99% of expected progress
- 🟠 **Needs Effort** - Started but below 70%
- 🔴 **Not Started** - No activity yet
- ⚪ **Pending** - Quarter hasn't started

**Updates:** Daily at 00:00 UTC via GitHub Actions

**Real-time Progress:**
```
| Quarter | Target | Actual | Status |
|---------|--------|--------|--------|
| Q1      | 900    | 247    | 🟡 Behind |
| Q2      | 910    | 0      | ⚪ Pending |
| Q3      | 920    | 0      | ⚪ Pending |
| Q4      | 920    | 0      | ⚪ Pending |
```

---

## 🤖 Automation

### GitHub Actions Workflows

#### 1. **Update Profile Stats** (`update-prs.yml`)
- **Runs:** Daily at 00:00 UTC
- **Updates:**
  - PR tracking (Laravel/Tabler)
  - Quarterly progress table
  - Daily commit log
- **Trigger:** Automatic + Manual via Actions tab

#### 2. **Update GitHub Stats** (`update-readme.yml`)
- **Runs:** Hourly
- **Updates:**
  - Commit count badges in Real-time Stats section
  - Repository statistics
- **Trigger:** Automatic + Manual via Actions tab

**Note:** GitHub stats cards (Activity Graph, Streak Stats, Stats Cards, Top Languages) update automatically via external services (github-readme-stats.vercel.app, etc.). The workflow updates the badge counters in the README.

---

## 📝 Available Commands

```bash
# Update everything
npm start

# Update PRs only
npm run update:prs

# Update quarterly stats only
npm run update:quarterly

# Update commit log only
npm run update:commits

# Update all stats (PRs + quarterly + commits)
npm run update:all

# Show summary report
npm run status
```

---

## 🎯 2026 Goals Breakdown

### Total Annual Goals
- **3,650 commits** (10 per day average)
- **365 PRs** (1 per day)

### Quarterly Targets
| Quarter | Commits | PRs | Days |
|---------|---------|-----|------|
| Q1      | 900     | 91  | 90   |
| Q2      | 910     | 91  | 91   |
| Q3      | 920     | 91  | 92   |
| Q4      | 920     | 92  | 92   |

---

## 🚀 How It Works

### 1. **Heatmaps** (External Services)
The heatmaps use external services that automatically fetch your GitHub data:
- No configuration needed
- Updates automatically with every commit
- No API keys required for public profiles

### 2. **PR Tracking** (Custom Script)
```javascript
// Fetches PRs from Laravel & Tabler
// Filters by your username
// Updates README automatically
```

### 3. **Quarterly Stats** (Smart Calculation)
```javascript
// Calculates expected progress based on:
// - Days passed in quarter
// - Target for quarter
// - Your actual commits/PRs

// Shows status:
// Behind if < 100% of expected
// On Track if >= 100% of expected
```

---

## 📊 Visual Preview

Your README now shows:

```
┌─────────────────────────────────────┐
│  📊 Real-time Stats                 │
│  (Badges and counters)              │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  📈 2026 Activity Heatmap           │
│                                     │
│  🔥 [Activity Graph]                │
│  📅 [Streak Stats]                  │
│  📊 [GitHub Stats] [Languages]      │
│  📊 [Quarterly Progress Table]      │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  🧩 Contributions                   │
│  (Laravel PRs, Tabler PRs, etc)     │
└─────────────────────────────────────┘
```

---

## 🎨 Customization

### Change Colors
Edit the theme parameters in README.md:
- `theme=dark` → `theme=radical`
- `theme=react-dark` → `theme=github-dark`

### Change Target Username
Edit `scripts/fetch-and-insert-prs.js`:
```javascript
const USERNAME = "mr-rijal"; // Change this
```

### Adjust Quarterly Targets
Edit `scripts/update-quarterly-stats.js`:
```javascript
const QUARTERS = [
  { name: "Q1", ..., targetCommits: 900, targetPRs: 91 },
  // Modify these numbers
];
```

---

## 🔐 GitHub Token (Optional)

For better API rate limits, set a GitHub token:

```bash
# Option 1: Export in terminal
export GITHUB_TOKEN=your_token_here

# Option 2: Add to GitHub Secrets
# Settings → Secrets → Actions → New secret
# Name: GITHUB_TOKEN
# Value: your_token_here
```

**Note:** The default `GITHUB_TOKEN` provided by GitHub Actions is automatically used.

---

## 🐛 Troubleshooting

### Heatmaps not showing?
- Images are loaded from external services
- May take a few seconds to load
- Check your internet connection

### Quarterly stats not updating?
```bash
# Run manually to test
npm run update:quarterly

# Check for errors in output
```

### PRs not appearing?
- Verify your username is correct
- Check you have PRs in Laravel/Tabler repos
- PRs must be authored by you

---

## 📈 What Happens Daily

**Every day at 00:00 UTC:**

1. ✅ GitHub Actions workflow triggers
2. ✅ Fetches your latest PRs from Laravel & Tabler
3. ✅ Calculates quarterly progress
4. ✅ Updates daily commit log with yesterday's commits
5. ✅ Updates README.md with all new stats
6. ✅ Commits changes automatically
7. ✅ Heatmaps refresh on next page load

**You don't have to do anything!** 🎉

---

## 🎯 Success Tips

1. **Commit daily** - Even small commits count!
2. **Focus on quality** - Meaningful contributions over quantity
3. **Stay consistent** - The streak is your friend
4. **Track progress** - Run `npm run status` weekly
5. **Adjust goals** - It's okay to recalibrate if needed

---

## 📚 Resources

- [GitHub Readme Stats](https://github.com/anuraghazra/github-readme-stats)
- [GitHub Readme Streak Stats](https://github.com/DenverCoder1/github-readme-streak-stats)
- [GitHub Activity Graph](https://github.com/Ashutosh00710/github-readme-activity-graph)
- [Shields.io](https://shields.io/)

---

**Ready to dominate 2026! 💪**

Keep pushing, stay consistent, and watch your stats grow! 🚀

