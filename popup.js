
document.addEventListener('DOMContentLoaded', function () {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log('Tabs:', tabs);
        const tabId = tabs[0].id;

        // Inject content script
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['contentScript.js']
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('Script injection error:', chrome.runtime.lastError.message);
                return;
            }

            // Send message after script is injected
            console.log('Sending message to content script');
            chrome.tabs.sendMessage(tabId, {
                action: 'getVideoURL'
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Message sending error:', chrome.runtime.lastError.message);
                } else {
                    console.log('Response from content script:', response);
                    if (response.success && response.action === "showThumbnailPreview") {
                        const thumbnailUrls = response.urls;
                        console.log('Thumbnail URLs:', thumbnailUrls);
                        const thumbnailImage = document.getElementById('thumbnailImg');
                        let currentIndex = 0;

                        thumbnailImage.src = thumbnailUrls[currentIndex];

                        document.getElementById('downloadQty').addEventListener('click', () => {
                            currentIndex = (currentIndex + 1) % thumbnailUrls.length;
                            thumbnailImage.src = thumbnailUrls[currentIndex];
                        });

                        document.getElementById('downloadBtn').addEventListener('click', () => {
                            let directory = document.getElementById('downloadDir').value;
                            let quality = document.getElementById('downloadQty').value;
                            
                            chrome.runtime.sendMessage({
                                action: "downloadThumbnail",
                                quality,
                                directory
                            });
                        });

                    } else {
                        console.error('Error extracting video ID:', response.error);
                    }
                }
            });
        });
    });
});




