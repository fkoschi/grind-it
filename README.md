<div align="center">
   <img src="./assets/images/icon.png" width="200" alt="Grind It Logo" />
</div>

<div align="center">

# Grind It

<div width="400">Grind It is the perfect app for coffee lovers who grind their beans at home. Easily track your beans, their origins, and the ideal grind settings to brew the perfect cup every time.</div>

</div>

## Version Management

This project uses automated version bumping with conventional commits.

### Making Commits

Use conventional commit prefixes:
- `feat:` - New feature (minor: 1.4.0 → 1.5.0)
- `fix:` - Bug fix (patch: 1.4.0 → 1.4.1)
- `feat!:` - Breaking change (major: 1.4.0 → 2.0.0)

### Releasing

```bash
# Auto-detect version bump from commits
npm run release

# Push changes and tags
git push --follow-tags origin main

# Build and submit to TestFlight
eas build --platform ios --profile production --auto-submit
```

## Development

```bash
npm start          # Start dev server
npm test           # Run tests
npm run format     # Format code
```
