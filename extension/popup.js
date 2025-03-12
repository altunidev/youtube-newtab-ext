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
