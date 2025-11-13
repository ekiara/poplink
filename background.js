chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSet') {
    const urls = request.urls;
    if (Array.isArray(urls)) {
      urls.forEach(url => {
        chrome.tabs.create({ url });
      });
    }
  }
});
