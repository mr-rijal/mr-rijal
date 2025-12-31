# 🔐 GitHub Token Setup Guide

## Option 1: Use Default GitHub Token (Simplest) ✅

**Good news!** GitHub Actions provides a token automatically. Your workflows already use it:

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**This token:**
- ✅ Works out of the box
- ✅ No setup required
- ✅ Automatically provided by GitHub
- ✅ Good for public repositories
- ⚠️ Limited to 1,000 requests/hour (might be restrictive)

**If you're hitting rate limits**, continue to Option 2.

---

## Option 2: Create Personal Access Token (Recommended for Better Limits)

### Step 1: Create a Personal Access Token

1. **Go to GitHub Settings:**
   - Click your profile picture (top right)
   - Click **Settings**
   - Or go directly: https://github.com/settings/tokens

2. **Navigate to Developer Settings:**
   - Scroll down in the left sidebar
   - Click **Developer settings**

3. **Go to Personal Access Tokens:**
   - Click **Personal access tokens**
   - Click **Tokens (classic)** (or **Fine-grained tokens** if preferred)

4. **Generate New Token:**
   - Click **Generate new token** → **Generate new token (classic)**

5. **Configure Token:**
   - **Note:** Give it a name like `GitHub Profile Tracker`
   - **Expiration:** Choose duration (30 days, 60 days, 90 days, or No expiration)
   - **Select scopes:**
     - ✅ `public_repo` (Access public repositories)
     - ✅ `read:user` (Read user profile data)
     - ✅ `repo` (Full control of private repositories) - Only if needed
     - ✅ `user:email` (Access user email addresses) - Optional

6. **Generate Token:**
   - Scroll down and click **Generate token**
   - ⚠️ **IMPORTANT:** Copy the token immediately (you won't see it again!)
   - It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Add Token to Repository Secrets

1. **Go to Your Repository:**
   - Navigate to your repository: `https://github.com/mr-rijal/mr-rijal`
   - Or any repository where you want to use the token

2. **Open Repository Settings:**
   - Click **Settings** tab (at the top of the repository)

3. **Go to Secrets:**
   - In the left sidebar, click **Secrets and variables**
   - Click **Actions**

4. **Add New Secret:**
   - Click **New repository secret** button
   - **Name:** `GITHUB_TOKEN` (or `PAT_TOKEN` if you prefer)
   - **Secret:** Paste your token (the `ghp_...` string)
   - Click **Add secret**

### Step 3: Update Workflows (If Using Custom Name)

If you named your secret something other than `GITHUB_TOKEN`, update your workflow files:

**File:** `.github/workflows/update-prs.yml`

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Uses default
  # OR
  GITHUB_TOKEN: ${{ secrets.PAT_TOKEN }}     # Uses custom name
```

**Note:** If you name it `GITHUB_TOKEN`, it will override the default token.

---

## Visual Guide: Where to Find Settings

```
GitHub Repository
└── Settings (tab at top)
    └── Secrets and variables (left sidebar)
        └── Actions
            └── New repository secret
                ├── Name: GITHUB_TOKEN
                ├── Secret: [paste your token]
                └── Add secret
```

---

## Which Token to Use?

### Use Default Token (`secrets.GITHUB_TOKEN`) If:
- ✅ Tracking public repositories only
- ✅ Making < 1,000 API calls/hour
- ✅ Want simplest setup (no configuration)
- ✅ Just getting started

### Use Personal Access Token If:
- ⚠️ Hitting rate limits (1,000 requests/hour)
- ✅ Need higher limits (5,000 requests/hour)
- ✅ Want to track private repositories
- ✅ Need more reliable API access

---

## Token Limits Comparison

| Token Type | Rate Limit | Best For |
|------------|------------|----------|
| Default (`GITHUB_TOKEN`) | 1,000 requests/hour | Public repos, small projects |
| Personal Access Token | 5,000 requests/hour | Higher volume, private repos |

---

## Security Best Practices

### ✅ DO:
- Use a token with minimum required permissions
- Set token expiration (don't use "No expiration" unless necessary)
- Store tokens only in GitHub Secrets (never commit to code)
- Use different tokens for different projects
- Rotate tokens periodically

### ❌ DON'T:
- Commit tokens to git repository
- Share tokens publicly
- Use tokens with admin permissions unless needed
- Store tokens in environment files that get committed
- Post tokens in issues, PRs, or comments

---

## Troubleshooting

### Error: "API rate limit exceeded"

**Solution:**
1. Check if you're using default token (limited to 1,000/hour)
2. Create a Personal Access Token
3. Add it to repository secrets
4. Workflow will automatically use it

### Error: "Bad credentials" or "Unauthorized"

**Solution:**
1. Verify token is correct (copy it again from GitHub)
2. Check token hasn't expired
3. Verify token has correct scopes (public_repo, read:user)
4. Make sure secret name matches workflow: `${{ secrets.GITHUB_TOKEN }}`

### Workflow Not Using Token

**Check:**
1. Verify secret name matches: `GITHUB_TOKEN`
2. Check workflow file has: `env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}`
3. Ensure secret is added to correct repository
4. Re-run workflow after adding secret

### Token Expired

**Solution:**
1. Generate a new token
2. Update the secret in repository settings
3. Workflow will automatically use new token

---

## Quick Checklist

- [ ] Created Personal Access Token (if needed)
- [ ] Copied token (ghp_...)
- [ ] Went to Repository → Settings → Secrets and variables → Actions
- [ ] Added new secret named `GITHUB_TOKEN`
- [ ] Pasted token value
- [ ] Verified workflow file uses `${{ secrets.GITHUB_TOKEN }}`
- [ ] Tested workflow runs successfully

---

## Testing Your Setup

### Test Locally First:

```bash
# Set token in your terminal
export GITHUB_TOKEN=ghp_your_token_here

# Run your scripts
npm start

# Check if it works without rate limit warnings
```

### Test in GitHub Actions:

1. Go to Actions tab
2. Select a workflow
3. Click "Run workflow"
4. Check logs for errors
5. Look for successful execution

---

## For Multiple Repositories

If you have multiple repositories:

### Option A: Per-Repository Secret (Recommended)
- Add secret to each repository individually
- More secure (each repo has its own token)
- Better access control

### Option B: Organization Secret
1. Go to Organization Settings
2. Secrets → Actions
3. Add organization secret
4. Select repositories that can access it

---

## Fine-Grained Tokens (Alternative)

GitHub also supports fine-grained tokens (newer option):

1. Settings → Developer settings → Personal access tokens
2. Click **Fine-grained tokens** → **Generate new token**
3. Select specific repositories
4. Choose exact permissions needed
5. More granular control

**Note:** Fine-grained tokens are newer and have different limits.

---

## Summary

### Quick Setup (Default Token - Already Working):
✅ **No action needed!** Your workflows already work with the default token.

### Enhanced Setup (Personal Access Token):
1. Create token: https://github.com/settings/tokens
2. Copy token (starts with `ghp_`)
3. Repository → Settings → Secrets → Actions
4. Add secret: Name `GITHUB_TOKEN`, paste token
5. Done! Workflows automatically use it

---

**Your workflows are already configured correctly!** The default token works, but adding a Personal Access Token gives you 5x better rate limits if needed.

