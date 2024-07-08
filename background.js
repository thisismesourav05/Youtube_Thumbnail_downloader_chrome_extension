

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "downloadThumbnail") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            const url = new URL(tab.url);
            console.log(url);

            const videoId = url.searchParams.get('v');
            const quality = request.quality;
            const directory = request.directory;

            const filename = `${Date.now()}_thumbnail_${quality}.jpg`;
            
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;

            const options = {
                url: thumbnailUrl,
                saveAs: false,
                filename: filename,
                conflictAction: "uniquify"
            };

            if (directory) {
                options.filename = `${directory}/${filename}`;
            }

            // Generate Notification
            chrome.downloads.download(options, (downloadId) => {
                if (chrome.runtime.lastError) {
                    console.error('Download error:', chrome.runtime.lastError.message);
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                } else {
                    chrome.notifications.create({
                        type: 'basic',
                        title: 'Thumbnail Downloaded',
                        message: `The thumbnail image '${filename}' has been downloaded.`,
                        iconUrl: 'icon.png'
                    });
                    sendResponse({ success: true, downloadId });
                }
            });

            // Return true to indicate that the response is asynchronous
            return true;
        });
    }
});


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "downloadThumbnail") {
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             const tab = tabs[0];
//             const url = new URL(tab.url);
//             console.log(url);

//             const videoId = url.searchParams.get('v');
//             const quality = request.quality;
//             const directory = request.directory;

//             const filename = `${Date.now()}_thumbnail_${quality}.jpg`;
//             const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;

//             const options = {
//                 url: thumbnailUrl,
//                 saveAs: false,
//                 filename: filename,
//                 conflictAction: "uniquify"
//             };

//             if (directory) {
//                 options.filename = `${directory}/${filename}`;
//             }

//             chrome.downloads.download(options, (downloadId) => {
//                 if (chrome.runtime.lastError) {
//                     console.error('Download error:', chrome.runtime.lastError.message);
//                     sendResponse({ success: false, error: chrome.runtime.lastError.message });
//                 } else {
//                     // Wait for the download to complete
//                     chrome.downloads.onChanged.addListener(function listener(delta) {
//                         if (delta.id === downloadId && delta.state && delta.state.current === "complete") {
//                             chrome.downloads.search({ id: downloadId }, (results) => {
//                                 const downloadItem = results[0];
//                                 const localPath = downloadItem.filename;

//                                 chrome.notifications.create({
//                                     type: 'basic',
//                                     title: 'Thumbnail Downloaded',
//                                     message: `The thumbnail image '${filename}' has been downloaded.`,
//                                     iconUrl: `file://${localPath}`  // Corrected to use `file://` protocol
//                                 });

//                                 // Remove the listener after handling the event
//                                 chrome.downloads.onChanged.removeListener(listener);
//                                 sendResponse({ success: true, downloadId });
//                             });
//                         }
//                     });
//                 }
//             });

//             // Return true to indicate that the response is asynchronous
//             return true;
//         });
//     }
// });
