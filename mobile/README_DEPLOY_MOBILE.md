# Deploy Mobile (Expo + EAS)

1. Install EAS CLI:

```bash
npm install -g eas-cli
# or
npm install --save-dev eas-cli
```

2. Log in to Expo:

```bash
eas login
# or use EXPO_TOKEN in CI
```

3. Build for Android (app bundle):

```bash
eas build -p android --profile production
```

4. Submit to Play Store:

```bash
eas submit -p android --latest
# or specify the build id
```

Notes:
- `eas.json` includes a `production` profile that builds `app-bundle` for Android.
- Configure `app.json` fields (`slug`, `android.package`, icons and splash) before building.
- Set `EXPO_TOKEN` as a secret in CI to run builds non-interactively.
