# New Tab

A clean, modern, and privacy-focused start page and homepage extension designed for Google Chrome and Mozilla Firefox. Built with React and TypeScript, New Tab replaces the default browser dashboard with a fast, customizable workspace tailored to your aesthetic and workflow.

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Available-4285F4?style=flat&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/new-tab/efkjicbjocdcgnbppfgfmppfjpfcfhaj)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox_Add--ons-Beta-FF7139?style=flat&logo=firefoxbrowser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/new-tab-public-beta/)
[![Version](https://img.shields.io/badge/version-0.8.2-blue.svg?style=flat)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](LICENSE)

---

## Overview

New Tab provides a clutter-free, aesthetic browsing foundation that balances minimal design with deep customization. Unlike conventional new-tab extensions that rely on external servers or collect telemetry, New Tab operates on a local-first architecture—storing your shortcuts, preferences, and cached wallpapers entirely within your browser's IndexedDB storage.

---

## Key Features

### Dynamic Wallpaper Engine
- **Unsplash Integration**: Stream curated high-resolution photography directly from Unsplash with automated refresh schedules (1, 4, 8, 12, or 24 hours).
- **Curated Search Topics**: Filter background photography by custom search keywords and themes.
- **Custom Image Support**: Upload local image files (up to 8 MB) or provide external image URLs.
- **Solid Minimalist Color**: Set custom solid color backgrounds with an integrated hex color picker.
- **Visual Post-Processing**: Fine-tune background blur intensity and dark tint overlays to maintain optimal contrast and icon readability.

### Shortcut and Dashboard Management
- **Integrated Icon Catalog**: Search and insert ready-to-use shortcuts from an online icon repository.
- **Custom Shortcut Creation**: Add personalized shortcuts with custom titles, URLs, and custom icon images or image URLs.
- **Drag-and-Drop Reorganization**: Rearrange shortcuts intuitively with smooth drag-and-drop mechanics or sort automatically in alphabetical order.
- **Custom Grid Layout**: Configure column counts (1 to 9 columns), container gap spacing, and overall icon sizing.
- **Icon Styling**: Adjust icon container background color, background opacity, and corner radius (from sharp tiles to rounded pills).
- **Context Menus**: Right-click any shortcut for quick editing or deletion.

### Unified Search Bar
- **Multi-Engine Support**: Switch seamlessly between Google, Bing, DuckDuckGo, or your browser's default search engine.
- **Custom Search Providers**: Define custom search query templates for specialized engines or internal tools.
- **Flexible Sizing**: Adjust search bar width from compact (125px) to expansive (1000px) or disable it entirely for a minimalist aesthetic.

### Data Ownership and Portability
- **Local-First Privacy**: No telemetry, tracking scripts, or account requirements. All data stays strictly on your machine.
- **Complete Backup and Restore**: Export your entire dashboard configuration—including settings, shortcuts, and wallpaper cache—into a portable JSON file.
- **Cross-Browser Portability**: Migrate configurations effortlessly between Chrome and Firefox instances with backward compatibility for legacy exports.

---

## Installation

### Official Web Stores

- **Google Chrome**: Install via the [Chrome Web Store](https://chromewebstore.google.com/detail/new-tab/efkjicbjocdcgnbppfgfmppfjpfcfhaj).
- **Mozilla Firefox**: Install via [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/new-tab-public-beta/).

### Manual Installation (Developer Mode)

1. Clone or download this repository.
2. Build the project using the instructions below.
3. Open your browser's extension management page:
   - **Chrome**: Navigate to `chrome://extensions/` and enable **Developer mode**.
   - **Firefox**: Navigate to `about:debugging#/runtime/this-firefox`.
4. Load the unpacked extension:
   - **Chrome**: Click **Load unpacked** and select the build output directory (`chrome`).
   - **Firefox**: Click **Load Temporary Add-on** and select the extension manifest or zip package (`firefox`).

---

## Tech Stack

- **Framework & UI**: React 18, TypeScript, Tailwind CSS, DaisyUI, Ant Design
- **State & Storage**: Dexie.js (IndexedDB wrapper), LocalStorage
- **Drag-and-Drop**: @dnd-kit (Core, Sortable, Utilities)
- **Validation**: Zod
- **Build Tooling**: Vite, PostCSS, ESLint
- **Extension API**: WebExtensions API (Manifest V3)

---

## Development Setup

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or compatible package manager

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Miyunn/new-tab-extension.git
   cd new-tab-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build production assets:
   ```bash
   npm run build
   ```

5. Lint the codebase:
   ```bash
   npm run lint
   ```

### Cross-Browser Build Script

To generate distribution directories and packages for both Chrome and Firefox:

```bash
chmod +x build.sh
./build.sh
```

The script compiles the TypeScript codebase with Vite, copies browser-specific manifests (`manifest/chrome.json` and `manifest/firefox.json`), and provides an option to create production ZIP archives.

---

## Status and Roadmap

New Tab is actively maintained. Ongoing updates focus on additional customization options, performance optimizations, and expanded search provider capabilities. Contributions, bug reports, and feature requests are welcome.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
