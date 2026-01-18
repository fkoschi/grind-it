---
description: How to build and publish the iOS app using EAS
---

To build the iOS app, you can use the EAS CLI.

## 0. Version Bump (Recommended)

Before building, it's recommended to bump the app version automatically:

1. **Make commits with conventional format**:
   - `feat: add new feature` → minor bump (1.4.0 → 1.5.0)
   - `fix: resolve bug` → patch bump (1.4.0 → 1.4.1)
   - `feat!: breaking change` → major bump (1.4.0 → 2.0.0)

2. **Run release command**:

   ```bash
   npm run release
   ```

   Or specify the bump type explicitly:

   ```bash
   npm run release:patch  # For bug fixes
   npm run release:minor  # For new features
   npm run release:major  # For breaking changes
   ```

3. **Push changes and tags**:
   ```bash
   git push --follow-tags origin main
   ```

## 1. Install EAS CLI

```bash
npm install -g eas-cli
```

## 2. Login to Expo

```bash
eas login
```

## 3. Build for iOS

You can build for different profiles defined in `eas.json`.

- **Development Build** (for simulator or device testing):

  ```bash
  eas build --platform ios --profile development
  ```

- **Preview Build** (for internal distribution):

  ```bash
  eas build --platform ios --profile preview
  ```

- **Production Build** (for App Store):
  ```bash
  eas build --platform ios --profile production
  ```

## 4. Submit to TestFlight

- **Automatic Submission**:

  ```bash
  eas build --platform ios --profile production --auto-submit
  ```

- **Manual Submission via EAS**:
  ```bash
  eas submit --platform ios
  ```

## 5. Follow the prompts

The CLI will guide you through the process, including setting up credentials if needed.
