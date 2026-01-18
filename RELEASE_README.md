# Release Process Guide

This document provides detailed information about the release process for Grind It, including versioning, building, and publishing to TestFlight.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Version Bumping Process](#version-bumping-process)
- [Understanding the Release Script](#understanding-the-release-script)
- [Building and Publishing](#building-and-publishing)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before creating a release, ensure you have:

1. **Clean Working Directory**: All changes should be committed

   ```bash
   git status  # Should show "nothing to commit, working tree clean"
   ```

2. **Correct Branch**: Always run releases from `main` branch

   ```bash
   git checkout main
   git pull origin main
   ```

3. **EAS CLI Installed & Authenticated**:
   ```bash
   npm install -g eas-cli
   eas login
   ```

## Version Bumping Process

### 1. Conventional Commits

Before creating a release, ensure your commits follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

| Commit Prefix                        | Version Bump          | Example                          |
| ------------------------------------ | --------------------- | -------------------------------- |
| `feat:`                              | Minor (1.4.0 → 1.5.0) | `feat: add dark mode support`    |
| `fix:`                               | Patch (1.4.0 → 1.4.1) | `fix: resolve dashboard flicker` |
| `feat!:` or `BREAKING CHANGE:`       | Major (1.4.0 → 2.0.0) | `feat!: redesign navigation`     |
| `chore:`, `docs:`, `style:`, `test:` | No bump               | Hidden from changelog            |

**Examples:**

```bash
git commit -m "feat: add fuzzy duplicate detection"
git commit -m "fix: prevent NoData flicker on navigation"
git commit -m "chore: update dependencies"
```

### 2. Running the Release Script

**Location**: Run from project root (`/Users/fkoschi/Code/grind-it`)

**Branch**: **Always run on `main` branch**

```bash
# Ensure you're on main
git checkout main

# Pull latest changes
git pull origin main

# Run release (auto-detects bump type from commits)
npm run release
```

**What This Does:**

1. Analyzes commits since the last tag
2. Determines version bump type (major/minor/patch)
3. Updates `package.json` version
4. Updates `app.json` expo version
5. Generates/updates `CHANGELOG.md` with commit history
6. Creates a git commit: `chore(release): X.X.X`
7. Creates a git tag: `vX.X.X`

### 3. Manual Version Bump

If you want to explicitly control the version bump:

```bash
# Patch release (bug fixes)
npm run release:patch

# Minor release (new features)
npm run release:minor

# Major release (breaking changes)
npm run release:major

# First release (no bump, just tag)
npm run release:first
```

### 4. Push Changes and Tags

**Critical Step**: Use `--follow-tags` to push both commits AND tags

```bash
git push --follow-tags origin main
```

**Why `--follow-tags` is Important:**

- `git push` alone only pushes commits, **not tags**
- Tags are used by EAS and App Store Connect to track versions
- Without tags, your version history will be incomplete
- Tags enable proper changelog generation for future releases
- `--follow-tags` pushes the commit AND any tags pointing to it

**Alternative (explicit):**

```bash
git push origin main
git push origin --tags
```

## Building and Publishing

### Development Build

For testing on simulator or physical devices:

```bash
eas build --platform ios --profile development
```

### Production Build

#### Option 1: Build and Auto-Submit to TestFlight

```bash
eas build --platform ios --profile production --auto-submit
```

**What happens:**

1. EAS builds your app with production profile
2. Automatically submits to App Store Connect
3. Build appears in TestFlight after Apple processing (~5-30 min)

#### Option 2: Build Then Submit Manually

```bash
# Build first
eas build --platform ios --profile production

# Then submit
eas submit --platform ios
```

### Complete Release Workflow

```bash
# 1. Ensure clean main branch
git checkout main
git pull origin main
git status

# 2. Bump version
npm run release

# 3. Review changes
git log -1  # View release commit
cat CHANGELOG.md  # Review changelog

# 4. Push to remote
git push --follow-tags origin main

# 5. Build and publish
eas build --platform ios --profile production --auto-submit
```

## Understanding the Configuration

### `.versionrc.json`

Configures `standard-version` behavior:

```json
{
  "types": [
    { "type": "feat", "section": "✨ Features" },
    { "type": "fix", "section": "🐛 Bug Fixes" },
    { "type": "refactor", "section": "♻️ Refactoring" },
    { "type": "perf", "section": "⚡ Performance" }
  ],
  "bumpFiles": [
    { "filename": "package.json", "type": "json" },
    { "filename": "app.json", "updater": "node_modules/@mccraveiro/standard-version-expo/index.js" }
  ]
}
```

**Key Points:**

- `types`: Defines which commit types appear in changelog
- `bumpFiles`: Specifies which files get version updates
- Expo updater handles `app.json` versioning automatically

### Version Synchronization

Both files will have the same version:

- `package.json` → `"version": "1.4.0"`
- `app.json` → `"expo.version": "1.4.0"`

## Troubleshooting

### "Not on main branch"

**Problem**: Release attempted on feature branch

**Solution**:

```bash
git checkout main
git pull origin main
npm run release
```

### "Dirty working directory"

**Problem**: Uncommitted changes exist

**Solution**:

```bash
git status
git add .
git commit -m "chore: prepare for release"
npm run release
```

### "Tag already exists"

**Problem**: Version tag already created

**Solution**:

```bash
# Delete local tag
git tag -d vX.X.X

# Delete remote tag (if pushed)
git push origin :refs/tags/vX.X.X

# Try release again
npm run release
```

### "No commits since last release"

**Problem**: No changes to bump

**Solution**:

- Make commits following conventional format
- Or use explicit bump: `npm run release:patch`

### Tags not showing in GitHub

**Problem**: Forgot `--follow-tags`

**Solution**:

```bash
git push origin --tags
```

## Best Practices

1. **Always release from `main`**: Never create releases from feature branches
2. **Keep commits conventional**: Use proper prefixes (`feat:`, `fix:`, etc.)
3. **Review CHANGELOG**: Check generated changelog before building
4. **Test before submit**: Use development builds to test before production
5. **Document breaking changes**: Use `BREAKING CHANGE:` in commit body for major changes
6. **One release at a time**: Don't create multiple releases simultaneously

## Quick Reference

```bash
# Complete release process
git checkout main && git pull
npm run release
git push --follow-tags origin main
eas build --platform ios --profile production --auto-submit

# Check current version
cat package.json | grep version
cat app.json | grep version

# View release history
git tag -l
git log --oneline --decorate
```
