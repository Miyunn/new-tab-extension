# Privacy Policy for New Tab

**Last updated:** November 9, 2026

This Privacy Policy describes how the **New Tab** browser extension ("New Tab", "we", "us", or "our") handles your information. 

We believe that your privacy is a fundamental right. New Tab is designed with a **local-first architecture**: we do not collect, track, sell, or transmit your personal data, browsing history, or activity.

---

## 1. What Information We Collect

**We do not collect any personally identifiable information (PII).**

- **No User Accounts:** You do not need to create an account or provide an email address to use New Tab.
- **No Analytics or Telemetry:** New Tab contains no tracking scripts, analytics libraries (e.g., Google Analytics), or behavioral tracking mechanisms.
- **No Browsing History Access:** New Tab does not monitor, inspect, or log the websites you visit or the links you click.

---

## 2. How Data is Stored (Local Storage Only)

All user configurations, preferences, and content remain strictly on your local device:

- **IndexedDB Storage:** Your customized shortcuts, icon positions, visual preferences (e.g., column count, icon size, blur, tint), and cached wallpapers are stored locally in your browser using IndexedDB.
- **Local Control:** You can export your data at any time via the Backup & Restore settings as a portable JSON file, or delete it completely by clearing your browser's site data or uninstalling the extension.

---

## 3. Third-Party Services and Network Requests

To deliver specific user-requested features, New Tab makes direct or proxied requests to third-party services:

1. **Favicon Resolution Services (`https://t2.gstatic.com`, `https://icon.horse`):**
   - When you add a new website shortcut, the extension requests the public favicon for that website to display on your dashboard.
   - The image is downloaded, converted locally to a base64 Data URL, and saved directly to your local IndexedDB for offline access.
   - No personal identifiers, cookies, or user activity are transmitted during these requests.

2. **Unsplash Wallpaper Integration & Proxy :**
   - If you enable dynamic Unsplash wallpapers, the extension queries a backend proxy to retrieve Unsplash image metadata matching your search topic or category.
   - If you choose to download the wallpaper, the image is fetched via the proxy.
   - These requests only transmit search queries you configure in settings (e.g., "nature", "architecture") and do not include any personal information.

3. **Icon Library Catalog :**
   - When searching the built-in icon catalog, search terms are sent to fetch matching icon assets.

4. **Search Queries:**
   - When you enter a query into the New Tab search bar, your search query is submitted directly to your selected search provider (such as Google, DuckDuckGo, Bing, or your custom search URL). 
   - Search queries are handled according to the privacy policy of the respective search engine you have chosen.

---

## 4. Extension Permissions

New Tab requests minimal browser permissions strictly to perform its core functions:

- `search`: Used to execute searches via your default browser search provider.
- `host_permissions` (`https://t2.gstatic.com/*`, `https://icon.horse/*`): Used strictly to fetch and download high-resolution favicon image data for offline local storage when shortcuts are created.
- `chrome_url_overrides` / `chrome_settings_overrides`: Replaces the default new tab and homepage with the New Tab dashboard.

We do not request broad permissions such as `<all_urls>`, web request interceptors, or cookie access.

---

## 5. Data Sharing and Disclosure

Because we do not collect or store your data on any central servers, **we do not sell, rent, trade, or share your data with any third parties**.

---

## 6. Children's Privacy

New Tab does not collect any personal information from anyone, including children under the age of 13.

---

## 7. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Any changes will be reflected by updating the "Last updated" date at the top of this document. Since we do not collect contact information, we encourage users to review this policy periodically on the project repository.

---

## 8. Contact Us

If you have any questions or feedback regarding this Privacy Policy or the security of the extension, please open an issue on the official GitHub repository:

- **GitHub Repository:** [https://github.com/](https://github.com/Miyunn/new-tab-extension)
