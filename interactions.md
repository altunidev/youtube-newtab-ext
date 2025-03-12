# How I coded this:

Entered the following into ChatGPT
`Can you write an extension for chrome that opens a youtube link replacing the string after youtube.com/ and before the video ID with /embed/ in a new tab`

Got this as an answer:

Yes, I can help you write a Chrome extension for this functionality. Below is a step-by-step guide and the code for the extension that opens a YouTube link in the embedded format in a new tab.

### Steps to create the Chrome Extension

1. **Create a new folder** for your extension (e.g., `youtube-embed-extension`).
2. Inside that folder, create the following files:
    - `manifest.json`
    - `background.js`
    - `popup.html`
    - `popup.js`

### `manifest.json`
This file defines the basic information about your extension.

```json
{
  "manifest_version": 3,
  "name": "YouTube Embed Link Opener",
  "version": "1.0",
  "description": "Opens YouTube videos as embedded links in a new tab.",
  "permissions": ["tabs"],
  "action": {
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "background.js"
  },
  "host_permissions": [
    "https://www.youtube.com/*"
  ]
}
```

### `background.js`
This script is used to handle any background logic. In this case, it doesn't do much but listen for a message and open a new tab when requested.

```javascript
chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Embed Link Opener Extension Installed");
});
```

### `popup.html`
This is the HTML for the popup that appears when you click on the extension icon.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Open YouTube Embed</title>
  <style>
    body { width: 250px; padding: 10px; font-family: Arial, sans-serif; }
    input { width: 100%; padding: 8px; margin-bottom: 10px; }
    button { width: 100%; padding: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
    button:hover { background-color: #45a049; }
  </style>
</head>
<body>
  <h3>Enter YouTube Link</h3>
  <input type="text" id="youtubeUrl" placeholder="Paste YouTube URL here">
  <button id="openEmbed">Open Embed Link</button>

  <script src="popup.js"></script>
</body>
</html>
```

### `popup.js`
This script will handle user input and open the embed link in a new tab.

```javascript
document.getElementById('openEmbed').addEventListener('click', () => {
  const url = document.getElementById('youtubeUrl').value;

  const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|(?:.*\/)?)([\w-]{11})/;
  const match = url.match(regex);

  if (match) {
    const videoId = match[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    chrome.tabs.create({ url: embedUrl });
  } else {
    alert('Please enter a valid YouTube URL');
  }
});
```

### How to Load Your Extension

1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode" in the top-right corner.
3. Click "Load unpacked" and select the folder where you created your extension files.
4. The extension icon should now appear in your toolbar.

### How the Extension Works

- When you click the extension icon, the popup appears.
- You paste a regular YouTube link (e.g., `https://www.youtube.com/watch?v=abc123xyz`) into the input field.
- The extension will extract the video ID from the URL and open it in a new tab with the embedded URL format (e.g., `https://www.youtube.com/embed/abc123xyz`).

This is a simple Chrome extension that performs the requested task. Let me know if you need more features or adjustments!

---

Entered this as a response:
`Actually change of plans -- let's have the extension be such that clicking on a button will open existing youtube video in new tab and pause current youtube video (if playing). However, also provide the same functionality as before, for pasting and opening manually.`

Got this as an answer:

Sure! I understand the new requirements now. Let's update the extension so that it works as follows:

1. **When clicking a button**:
   - It will open the current YouTube video (if any) in an embed format in a new tab.
   - If a YouTube video is currently playing, it will pause that video before opening the new tab.

2. **Manual input**:
   - You can still paste a YouTube URL and open it in the embed format in a new tab manually, just like before.

### Here's the updated plan:

1. **Manifest**: Adjust to reflect changes in functionality.
2. **Content Script**: Detect the current YouTube video and pause it if playing.
3. **Popup**: Provide input for pasting a link and a button for the automatic action.

### Updated Files

#### 1. `manifest.json`

This file needs to reflect the extension's updated functionality, and we will still use a content script for detecting the current video.

```json
{
  "manifest_version": 3,
  "name": "YouTube Embed Link Opener",
  "version": "1.2",
  "description": "Open YouTube videos in embed format and pause current video.",
  "permissions": ["tabs", "activeTab"],
  "action": {
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "background.js"
  },
  "host_permissions": [
    "https://www.youtube.com/*"
  ],
  "content_scripts": [
    {
      "matches": ["https://www.youtube.com/*"],
      "js": ["content.js"]
    }
  ]
}
```

#### 2. `content.js`

The content script will now handle pausing the current video if it is playing and opening the embed version in a new tab.

```javascript
// Function to open the embed link of the current video
function openEmbedLink(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|(?:.*\/)?)([\w-]{11})/;
  const match = url.match(regex);

  if (match) {
    const videoId = match[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    window.open(embedUrl, "_blank", "width=800,height=600");
  }
}

// Function to pause the current video if it's playing
function pauseCurrentVideo() {
  const videoElement = document.querySelector('video');
  if (videoElement && !videoElement.paused) {
    videoElement.pause();
  }
}

// Listen for a message from the popup to open the embed link for the current video
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "open_embed_and_pause") {
    const currentUrl = window.location.href;
    pauseCurrentVideo();
    openEmbedLink(currentUrl);
  }
});
```

#### 3. `popup.html`

The popup will now have:
- A field to paste a YouTube link manually.
- A button to automatically open the current YouTube video in embedded format and pause it.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Open YouTube Embed</title>
  <style>
    body { width: 250px; padding: 10px; font-family: Arial, sans-serif; }
    input { width: 100%; padding: 8px; margin-bottom: 10px; }
    button { width: 100%; padding: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
    button:hover { background-color: #45a049; }
    #openCurrentVideo { background-color: #2196F3; }
    #openCurrentVideo:hover { background-color: #0b7dda; }
  </style>
</head>
<body>
  <h3>Enter YouTube Link</h3>
  <input type="text" id="youtubeUrl" placeholder="Paste YouTube URL here">
  <button id="openEmbed">Open Embed Link</button>
  <button id="openCurrentVideo">Open Current Video in Embed</button>

  <script src="popup.js"></script>
</body>
</html>
```

#### 4. `popup.js`

This script handles:
- Pasting a YouTube link and opening it as an embedded link.
- Sending a message to the content script to open the current YouTube video in the embed format and pause it.

```javascript
document.getElementById('openEmbed').addEventListener('click', () => {
  const url = document.getElementById('youtubeUrl').value;

  const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|(?:.*\/)?)([\w-]{11})/;
  const match = url.match(regex);

  if (match) {
    const videoId = match[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    chrome.tabs.create({ url: embedUrl });
  } else {
    alert('Please enter a valid YouTube URL');
  }
});

document.getElementById('openCurrentVideo').addEventListener('click', () => {
  // Send a message to the content script to open the embed link and pause the video
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => chrome.runtime.sendMessage({ action: "open_embed_and_pause" })
    });
  });
});
```

#### 5. `background.js`

This file can stay the same as before; it doesn't require modifications for the new behavior.

```javascript
chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Embed Link Opener Extension Installed");
});
```

### How the Extension Works Now

1. **Manual Input**: You can still paste any YouTube URL into the input field and open it in an embed format in a new tab.
2. **Open Current Video**: If you're currently on a YouTube video page, clicking the **"Open Current Video in Embed"** button will:
   - Pause the current video (if it's playing).
   - Open the video in the embed format in a new popup tab.
3. **No Need to Paste URL for Current Video**: The button automatically detects and uses the current YouTube URL.

### How to Install

1. Open `chrome://extensions/` in Chrome.
2. Enable **Developer Mode**.
3. Click **Load unpacked** and select the folder with your extension files.
4. You should now see the updated extension in your toolbar.

When you're on YouTube and want to open a video in embed format, you can either:
- Paste a link manually in the popup.
- Use the **"Open Current Video in Embed"** button to open and pause the video automatically.

Let me know if you'd like further adjustments!