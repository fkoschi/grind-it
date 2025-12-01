---
description: How to build the iOS app using EAS
---

To build the iOS app, you can use the EAS CLI.

1.  **Install EAS CLI** (if not already installed):
    ```bash
    npm install -g eas-cli
    ```

2.  **Login to Expo**:
    ```bash
    eas login
    ```

3.  **Build for iOS**:
    You can build for different profiles defined in `eas.json`.

    -   **Development Build** (for simulator or device testing):
        ```bash
        eas build --platform ios --profile development
        ```

    -   **Preview Build** (for internal distribution):
        ```bash
        eas build --platform ios --profile preview
        ```

    -   **Production Build** (for App Store):
        ```bash
        eas build --platform ios --profile production
        ```

4.  **Follow the prompts**:
    The CLI will guide you through the process, including setting up credentials if needed.
