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
  // Get the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    // Ensure that we have access to chrome.scripting and that the tab is correct
    if (chrome.scripting) {
      // Execute the script in the active tab to pause the video and open embed link
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: openEmbedAndPause
      });
    } else {
      // console.error('chrome.scripting is not available.');
    }
  });
});

// Function to be executed in the content script context
function openEmbedAndPause() {
  const currentUrl = window.location.href;

  // Pause the current video
  const videoElement = document.querySelector('video');
  if (videoElement && !videoElement.paused) {
    videoElement.pause();
  }

  // Extract the video ID and open embed version in a new tab
  const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|(?:.*\/)?)([\w-]{11})/;
  const match = currentUrl.match(regex);
  if (match) {
    const videoId = match[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    window.open(embedUrl, "_blank", "width=800,height=600");
  }
}
