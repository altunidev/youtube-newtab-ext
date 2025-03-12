// Focus the input field when the popup is opened
window.onload = function() {
  const inputField = document.getElementById('youtubeUrl');
  inputField.focus();
  inputField.select(); // Select the text if there's any
};

// Event listener for the "Open Embed Link" button
document.getElementById('openEmbed').addEventListener('click', () => {
  const url = document.getElementById('youtubeUrl').value;
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = ''; // Reset error message

  const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|(?:.*\/)?)([\w-]{11})/;
  const match = url.match(regex);

  if (match) {
    const videoId = match[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    chrome.tabs.create({ url: embedUrl });
  } else {
    errorMessage.textContent = 'Please enter a valid YouTube URL';
  }

  // Hide the hidden GIF after clicking the button (just as an example)
  document.getElementById('hiddenGif').style.display = 'none';
});

// Event listener for the "Enter" key on the input field to trigger the same action as the button
document.getElementById('youtubeUrl').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    // Trigger the "Open Embed Link" button click functionality when Enter is pressed
    document.getElementById('openEmbed').click();
  }
});

// Event listener for the "Open Current Video in Embed" button
document.getElementById('openCurrentVideo').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => chrome.runtime.sendMessage({ action: "open_embed_and_pause" })
    });
  });
});
