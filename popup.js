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
  