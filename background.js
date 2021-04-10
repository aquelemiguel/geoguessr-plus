chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    // chrome.scripting.insertCSS({
    //     target: { tabId: details.tabId },
    //     files: ['styles/themes.css']
    // });

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

        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['scripts/more-round-info.js']
        });

        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['scripts/streak-show-flags.js']
        });
    }
});