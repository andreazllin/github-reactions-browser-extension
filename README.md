# GitHub Reactions Browser Extension

A browser extension that displays a summary of all reactions on GitHub Issues, Pull Requests, and Discussions in the sidebar for quick navigation.

## Features

- **Reaction Summary** — See all reactions at a glance in the sidebar
- **Quick Navigation** — Click on any reaction row to jump directly to that comment
- **Multi-Page Support**:
  - Issues (React-based UI)
  - Pull Requests (classic UI)
  - Discussions (with upvotes support)
- **Live Updates** — Automatically refreshes when new comments are loaded
- **Color-Coded Pills** — Each emoji type has its own color for easy identification

## Installation

1. Download the latest release from [GitHub Releases](../../releases)
   - `chrome.zip` for Chrome/Chromium browsers
   - `firefox.zip` for Firefox
2. Extract the zip file to a folder

### Chrome / Chromium-based browsers (Edge, Brave, Arc, etc.)

1. Open Chrome Extensions (`chrome://extensions`)
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the extracted folder

### Firefox

1. Go to Settings → Extensions & Themes
2. Click the gear icon and select **Debug Add-ons**
3. Click **Load Temporary Add-on...**
4. Select the `manifest.json` file from the extracted folder

> **Note:** Firefox temporary add-ons are removed when the browser is closed. For permanent installation, sign the extension through [Mozilla Add-ons](https://addons.mozilla.org).

## Usage

1. Navigate to any GitHub Issue, Pull Request, or Discussion
2. Look for the reactions panel in the sidebar (appears below the issue metadata)
3. Click on any row to jump to that comment

## Development

```bash
# Install dependencies
pnpm install

# Build the extension
pnpm build

# Build with watch mode
pnpm dev

# Lint and format
pnpm lint
```

The built extension will be in the `dist/` folder.
