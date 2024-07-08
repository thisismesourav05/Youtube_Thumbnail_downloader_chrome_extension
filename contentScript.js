
// console.log('contentScript.js loaded');

// function getYoutubeVideoId(url) {
//     const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

//     const match = url.match(regExp)
//     return match && match[7].length === 11 ? match[7] : false
// }

// function getThumbnailUrls(videoId) {
//     return [
//         `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
//         `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
//         `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
//     ];
// }

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log('Received message in content script:', request);
//     if (request.action === "getVideoURL") {
//         const videoURL = window.location.href;
//         console.log('Video URL:', videoURL);
//         const videoId = getYoutubeVideoId(videoURL);

//         if (videoId) {
//             const thumbnailUrls = getThumbnailUrls(videoId)
//             chrome.runtime.sendMessage({
//                 action:"showThumbnailPreview",
//                 urls:thumbnailUrls
//             })
//             // sendResponse({ success: true, urls: thumbnailUrls })
//         }
//     }
// });


console.log('contentScript.js loaded');

function getYoutubeVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : false;
}

function getThumbnailUrls(videoId) {
    return [
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    ];
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message in content script:', request);
    if (request.action === "getVideoURL") {
        const videoURL = window.location.href;
        console.log('Video URL:', videoURL);
        const videoId = getYoutubeVideoId(videoURL);

        if (videoId) {
            const thumbnailUrls = getThumbnailUrls(videoId);
            sendResponse({
                success: true,
                urls: thumbnailUrls,
                action: "showThumbnailPreview",
            });
        } else {
            sendResponse({ success: false, error: 'Could not extract video ID from URL.' });
        }
        return true;
    }
});
