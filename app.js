chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    console.log(details.url);

    if (details.url.includes('/me/current')) {
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['scripts/delete-all-ongoing.js']
        });
    }

    else if (details.url.includes('/game')) {
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['scripts/show-rules.js']
        });
    }
});