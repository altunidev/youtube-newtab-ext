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
  
  chrome.runtime.onMessage.addListener((message) => {
    console.log("Message received:", message); // Debugging log
    if (message.action === "open_embed_and_pause") {
      const currentUrl = window.location.href;
      console.log("Current URL:", currentUrl); // Debugging log
      pauseCurrentVideo();
      openEmbedLink(currentUrl);
    }
  });
  