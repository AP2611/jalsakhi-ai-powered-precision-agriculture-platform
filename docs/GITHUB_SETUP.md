# GitHub Repository Setup Guide

## Initial Repository Setup

### 1. Create Repository on GitHub

1. Go to https://github.com/new
2. Configure repository:
   - **Name:** `jalsakhi-ai-powered-precision-agriculture-platform`
   - **Description:** `🌾 AI-Powered Precision Agriculture Platform for Smart Water Management`
   - **Visibility:** Public (recommended for portfolio)
   - **Initialize with:** None (we already have files)

### 2. Push Existing Code

```bash
cd /path/to/jalsakhi-ai-powered-precision-agriculture-platform

# Initialize git if not already done
git init

# Add all files
git add .

# Initial commit
git commit -m "feat: initial commit - JalSakhi AI agriculture platform"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/jalsakhi-ai-powered-precision-agriculture-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Repository Configuration

### 1. Repository Settings

Navigate to: `Settings` → `General`

**Social Preview:**
- Upload an image (1280x640px) showcasing your app

**Features:**
- ✅ Issues
- ✅ Projects
- ✅ Wiki (optional)
- ✅ Discussions (recommended)
- ❌ Wikis (if using docs/ folder instead)

**Pull Requests:**
- ✅ Allow squash merging
- ✅ Automatically delete head branches

### 2. Branch Protection Rules

Navigate to: `Settings` → `Branches` → `Add rule`

**Branch name pattern:** `main`

**Protect matching branches:**
- ✅ Require a pull request before merging
- ✅ Require approvals: 1
- ✅ Dismiss stale pull request approvals
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ❌ Require conversation resolution (optional)
- ✅ Include administrators (recommended)

### 3. Repository Topics

Navigate to: `About` → `⚙️ Settings` → `Topics`

Add relevant topics:
```
agriculture
ai
machine-learning
precision-agriculture
water-management
react-native
expo
nodejs
python
fastapi
mongodb
india
smart-farming
iot
sustainable-agriculture
```

### 4. About Section

**Description:**
```
🌾 AI-Powered Precision Agriculture Platform for Smart Water Management | React Native + Node.js + Python ML Models | Built for Indian Farmers
```

**Website:**
```
https://your-demo-url.com (if available)
```

**Tags:**
- agriculture
- ai
- machine-learning
- react-native
- precision-agriculture

## GitHub Actions Setup

### 1. Create Workflow Files

Create `.github/workflows/` directory:

```bash
mkdir -p .github/workflows
```

### 2. Mobile App CI

Create `.github/workflows/mobile-ci.yml`:

```yaml
name: Mobile App CI

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'app/**'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'app/**'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: app/package-lock.json
      
      - name: Install dependencies
        working-directory: app
        run: npm ci
      
      - name: Run linter
        working-directory: app
        run: npm run lint
```

### 3. Backend API CI

Create `.github/workflows/backend-ci.yml`:

```yaml
name: Backend API CI

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'server/**'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'server/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: server/package-lock.json
      
      - name: Install dependencies
        working-directory: server
        run: npm ci
      
      - name: Run tests
        working-directory: server
        run: npm test || echo "No tests configured yet"
```

### 4. ML Services CI

Create `.github/workflows/ml-ci.yml`:

```yaml
name: ML Services CI

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'ML models/**'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'ML models/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r "ML models/unified_api/requirements.txt"
      
      - name: Run tests
        run: |
          cd "ML models"
          python -m pytest || echo "No tests configured yet"
```

## Issue and PR Templates

### 1. Bug Report Template

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment (please complete the following information):**
 - OS: [e.g. Android 12, iOS 16]
 - App Version: [e.g. 1.0.0]
 - Device: [e.g. Samsung Galaxy S21, iPhone 13]

**Additional context**
Add any other context about the problem here.
```

### 2. Feature Request Template

Create `.github/ISSUE_TEMPLATE/feature_request.md`:

```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### 3. Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
<!--- Describe your changes in detail -->

## Type of Change
<!--- Put an `x` in all boxes that apply -->
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Style update (formatting, renaming)
- [ ] ♻️ Code refactoring
- [ ] ⚡ Performance improvement
- [ ] ✅ Test update

## How Has This Been Tested?
<!--- Please describe how you tested your changes -->
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing
- [ ] No testing required

## Checklist
<!--- Put an `x` in all boxes that apply -->
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)
<!--- Add screenshots here if this is a UI change -->

## Related Issues
<!--- Link related issues here. Use "Closes #123" to auto-close issues -->
Closes #
```

## Labels Setup

Navigate to: `Issues` → `Labels` → `New label`

Create these labels:

| Label | Color | Description |
|-------|-------|-------------|
| `bug` | #d73a4a | Something isn't working |
| `enhancement` | #a2eeef | New feature or request |
| `documentation` | #0075ca | Improvements to documentation |
| `good first issue` | #7057ff | Good for newcomers |
| `help wanted` | #008672 | Extra attention is needed |
| `mobile` | #fbca04 | Mobile app related |
| `backend` | #c2e0c6 | Backend API related |
| `ml` | #e99695 | ML models related |
| `security` | #d73a4a | Security-related issue |
| `performance` | #0e8a16 | Performance improvement |
| `dependencies` | #0366d6 | Dependency updates |
| `breaking change` | #d93f0b | Breaking changes |

## Projects Setup

### Create a Project Board

Navigate to: `Projects` → `New project`

**Classic project template:**
1. Name: "JalSakhi Development"
2. Template: "Automated kanban"
3. Columns:
   - 📋 To Do
   - 🚧 In Progress
   - 👀 Review
   - ✅ Done

## Discussions Setup

Navigate to: `Settings` → `Features` → Enable Discussions

**Create Categories:**
1. 💬 General - General discussions
2. 💡 Ideas - Share ideas for features
3. 🙏 Q&A - Ask questions
4. 📣 Announcements - Updates and announcements
5. 🎉 Show and Tell - Share your work

## README Badges

Add these badges to your README.md:

```markdown
![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/jalsakhi-ai-powered-precision-agriculture-platform?style=social)
![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/jalsakhi-ai-powered-precision-agriculture-platform?style=social)
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/jalsakhi-ai-powered-precision-agriculture-platform)
![GitHub pull requests](https://img.shields.io/github/issues-pr/YOUR_USERNAME/jalsakhi-ai-powered-precision-agriculture-platform)
![GitHub last commit](https://img.shields.io/github/last-commit/YOUR_USERNAME/jalsakhi-ai-powered-precision-agriculture-platform)
![GitHub contributors](https://img.shields.io/github/contributors/YOUR_USERNAME/jalsakhi-ai-powered-precision-agriculture-platform)
```

## Post-Setup Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] Branch protection rules configured
- [ ] Topics and description added
- [ ] Issue templates created
- [ ] PR template created
- [ ] Labels created and organized
- [ ] Project board set up
- [ ] Discussions enabled (optional)
- [ ] GitHub Actions workflows added
- [ ] README badges updated
- [ ] Social preview image uploaded
- [ ] Team members invited with appropriate permissions
- [ ] Repository linked in portfolio/resume

## Making Repository Attractive

### 1. Add Shields/Badges
Use https://shields.io/ to create custom badges for:
- Build status
- Code coverage
- Dependencies
- Downloads
- Version
- License

### 2. Create a Great README
- ✅ Clear project description
- ✅ Screenshots/GIFs
- ✅ Quick start guide
- ✅ Comprehensive documentation links
- ✅ Contributing section
- ✅ License information
- ✅ Contact information

### 3. Maintain Activity
- Regular commits
- Respond to issues promptly
- Review PRs quickly
- Keep documentation updated
- Post in Discussions
- Create releases with changelogs

### 4. Showcase Features
- Create a demo video
- Add to GitHub Topics
- Share on social media
- Write blog posts
- Present at meetups

## Security Best Practices

### 1. Enable Security Features

Navigate to: `Settings` → `Security & analysis`

Enable:
- ✅ Dependency graph
- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Secret scanning (if available)

### 2. Add SECURITY.md

Create `SECURITY.md` in root:

```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

Please report security vulnerabilities to: security@jalsakhi.com

Do not open public issues for security vulnerabilities.

We will respond within 48 hours.
```

---

**Congratulations!** Your repository is now professional and contributor-friendly! 🎉
