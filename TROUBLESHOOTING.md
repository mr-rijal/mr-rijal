# 🔧 Troubleshooting Guide

## Common Issues and Solutions

---

## 🚨 GitHub Stats Service Unavailable (503 Error)

### Problem
You see: `503: SERVICE_UNAVAILABLE - DEPLOYMENT_PAUSED` when loading stats images.

### Cause
The public instance of `github-readme-stats.vercel.app` is sometimes paused or rate-limited.

### Solution: Use Alternative Instances

Replace the stats URLs in your `README.md` with one of these working alternatives:

#### **Option 1: Rickstaa's Fork (Currently Used)**
```markdown
![GitHub Stats](https://github-readme-stats-git-masterrstaa-rickstaa.vercel.app/api?username=mr-rijal&show_icons=true&theme=dark&hide_border=true&count_private=true&include_all_commits=true)

![Top Languages](https://github-readme-stats-git-masterrstaa-rickstaa.vercel.app/api/top-langs/?username=mr-rijal&layout=compact&theme=dark&hide_border=true&langs_count=8)
```

#### **Option 2: Alternative Public Instance**
```markdown
![GitHub Stats](https://github-readme-stats-sigma-five.vercel.app/api?username=mr-rijal&show_icons=true&theme=dark&hide_border=true&count_private=true&include_all_commits=true)

![Top Languages](https://github-readme-stats-sigma-five.vercel.app/api/top-langs/?username=mr-rijal&layout=compact&theme=dark&hide_border=true&langs_count=8)
```

#### **Option 3: Another Stable Fork**
```markdown
![GitHub Stats](https://github-readme-stats-ouuan.vercel.app/api?username=mr-rijal&show_icons=true&theme=dark&hide_border=true&count_private=true&include_all_commits=true)

![Top Languages](https://github-readme-stats-ouuan.vercel.app/api/top-langs/?username=mr-rijal&layout=compact&theme=dark&hide_border=true&langs_count=8)
```

#### **Option 4: Self-Host (Most Reliable)**

1. Fork the repository: https://github.com/anuraghazra/github-readme-stats
2. Deploy to your own Vercel account (free tier available)
3. Use your own URL: `https://github-readme-stats-YOUR-USERNAME.vercel.app/api/...`

**Steps to self-host:**
```bash
1. Go to https://github.com/anuraghazra/github-readme-stats
2. Click "Fork"
3. Go to https://vercel.com
4. Sign in with GitHub
5. Import your forked repository
6. Deploy (takes ~2 minutes)
7. Use your new URL in README.md
```

#### **Option 5: Remove Stats Cards (Simplest)**

If services are consistently down, you can remove the stats cards and rely on the activity graph and streak stats:

```markdown
### 📅 Current Streak & Stats

<div align="center">

![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=mr-rijal&theme=dark&hide_border=true&date_format=M%20j%5B%2C%20Y%5D)

</div>
```

---

## 🔄 Scripts Not Running

### Problem
`npm start` fails or produces errors.

### Solution 1: Check Node Version
```bash
node --version  # Should be 18.0.0 or higher
```

If lower:
```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install latest Node
nvm install 20
nvm use 20
```

### Solution 2: Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Solution 3: Check for Syntax Errors
```bash
# Run individual scripts to isolate the issue
npm run update:prs
npm run update:quarterly
```

---

## 🔐 GitHub API Rate Limit

### Problem
Error: `API rate limit exceeded`

### Solution: Add GitHub Token

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it a name: "GitHub Profile Tracker"
   - Select scopes: `public_repo`, `read:user`
   - Generate and copy the token

2. **Add Token Locally:**
   ```bash
   export GITHUB_TOKEN=your_token_here
   npm start
   ```

3. **Add Token to GitHub Actions:**
   - Go to your repo → Settings → Secrets → Actions
   - Click "New repository secret"
   - Name: `GITHUB_TOKEN`
   - Value: (paste your token)

**Note:** The default `GITHUB_TOKEN` provided by GitHub Actions usually works fine.

---

## 📊 Quarterly Stats Not Updating

### Problem
Quarterly table shows old data or all zeros.

### Solution 1: Run Manually
```bash
npm run update:quarterly
```

Check for errors in the output.

### Solution 2: Verify Date
The script uses system date. Ensure your system clock is correct:
```bash
date
```

### Solution 3: Check GitHub API
```bash
# Test API access
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/users/mr-rijal/events
```

---

## 🔴 Workflow Failing on GitHub Actions

### Problem
GitHub Actions show failed workflow runs.

### Check 1: View Logs
1. Go to your repo → Actions tab
2. Click the failed workflow
3. Click the job that failed
4. Read the error logs

### Check 2: Common Fixes

**Error: "npm: command not found"**
- Make sure `actions/setup-node@v3` step is present
- Node version is specified (20)

**Error: "Permission denied"**
- Check repository Settings → Actions → General
- Set Workflow permissions to "Read and write permissions"

**Error: "README.md unchanged"**
- This is okay! It means no new data was found
- Workflow might fail on commit if no changes

### Fix: Allow Empty Commits
Update `.github/workflows/update-prs.yml`:

```yaml
- name: Commit and push
  run: |
    git config --global user.name "github-actions[bot]"
    git config --global user.email "github-actions[bot]@users.noreply.github.com"
    git add README.md
    git diff --staged --quiet || git commit -m "chore: update PR section"
    git push
```

---

## 🎨 Heatmap Not Loading

### Problem
Activity graph shows broken image or doesn't load.

### Solution 1: Check Service Status
Visit the service URL directly:
- https://github-readme-activity-graph.vercel.app/
- https://github-readme-streak-stats.herokuapp.com/

If down, use alternatives:

**Alternative Activity Graph Services:**
```markdown
<!-- Option 1: Ashutosh00710's instance -->
![Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=mr-rijal&theme=react-dark)

<!-- Option 2: GitHub's native contribution graph -->
![Contributions](https://ghchart.rshah.org/mr-rijal)

<!-- Option 3: Simple text-based -->
[![GitHub Activity](https://img.shields.io/github/commit-activity/m/mr-rijal/mr-rijal?style=for-the-badge)](https://github.com/mr-rijal)
```

### Solution 2: Cache Issues
Add a cache-busting parameter:
```markdown
![Activity](https://url.com/graph?username=mr-rijal&v=2)
```

Change `v=2` to `v=3`, etc. when updating.

---

## 📝 README Not Updating Automatically

### Problem
Stats don't update even though workflow runs successfully.

### Check 1: Verify Markers
Ensure these markers exist in `README.md`:
```markdown
<!-- PR_TRACKER_START -->
(content here)
<!-- PR_TRACKER_END -->
```

### Check 2: Verify Workflow Schedule
Check `.github/workflows/update-prs.yml`:
```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Runs at 00:00 UTC daily
  workflow_dispatch:      # Allows manual trigger
```

### Check 3: Run Manually
1. Go to Actions tab
2. Select "Update Profile Stats" workflow
3. Click "Run workflow"
4. Check if it completes successfully

---

## 🐛 PRs Not Showing Up

### Problem
You have PRs in Laravel/Tabler but they don't appear in README.

### Solution 1: Verify Username
Check `scripts/fetch-and-insert-prs.js`:
```javascript
const USERNAME = "mr-rijal";  // Must match your GitHub username exactly
```

### Solution 2: Check Repository List
```javascript
const REPOS = ["laravel/framework", "tabler/tabler"];
```

Add more repos if needed:
```javascript
const REPOS = [
  "laravel/framework", 
  "tabler/tabler",
  "your-org/your-repo"  // Add custom repos
];
```

### Solution 3: Test API Access
```bash
# Test fetching PRs
curl "https://api.github.com/repos/laravel/framework/pulls?state=all&per_page=100" | grep "mr-rijal"
```

---

## ⭐ Star History Not Loading

### Problem
Star History chart not displaying.

### Solution 1: Check Service
Visit: https://star-history.com/

### Solution 2: Alternative Star Tracking

**Option 1: GitHub Star Sparkline**
```markdown
![Stars](https://img.shields.io/github/stars/mr-rijal/mr-rijal?style=social)
```

**Option 2: Star Badge**
```markdown
[![GitHub Stars](https://img.shields.io/github/stars/mr-rijal/mr-rijal?style=for-the-badge&logo=github)](https://github.com/mr-rijal/mr-rijal/stargazers)
```

**Option 3: Simple Link**
```markdown
⭐ [Star this repo on GitHub](https://github.com/mr-rijal/mr-rijal) ⭐
```

---

## 💻 Service Alternatives Comparison

| Service | Reliability | Speed | Features | Recommended |
|---------|-------------|-------|----------|-------------|
| Rickstaa's Fork | ⭐⭐⭐⭐⭐ | Fast | Full | ✅ Yes |
| Original | ⭐⭐⭐ | Fast | Full | ⚠️ Sometimes down |
| Self-hosted | ⭐⭐⭐⭐⭐ | Fast | Full | ✅ Best |
| Ghchart | ⭐⭐⭐⭐ | Fast | Basic | ✅ Simple |
| Streak Stats | ⭐⭐⭐⭐⭐ | Fast | Streaks | ✅ Yes |
| Activity Graph | ⭐⭐⭐⭐ | Medium | Full | ✅ Yes |
| Star History | ⭐⭐⭐⭐ | Fast | Stars | ✅ Yes |

---

## 🆘 Still Having Issues?

### Debug Mode
Run with debug output:
```bash
# Enable verbose logging
DEBUG=* npm start

# Or check individual scripts
node scripts/fetch-and-insert-prs.js
node scripts/update-quarterly-stats.js
```

### Check System
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check Git
git --version

# Check internet connection
ping github.com
```

### Report an Issue
If you're still stuck, check:
1. README.md for typos in URLs
2. GitHub Actions logs for detailed errors
3. Console output when running locally
4. Service status pages

---

## 📚 Useful Links

- [GitHub README Stats Issues](https://github.com/anuraghazra/github-readme-stats/issues)
- [Vercel Status](https://www.vercel-status.com/)
- [GitHub API Status](https://www.githubstatus.com/)
- [Node.js Downloads](https://nodejs.org/)

---

**Last Updated:** January 1, 2026  
**Status:** All services operational ✅

