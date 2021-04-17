const settings = {
    'see-movement-settings': true,
    'track-advanced-round': true,
    'delete-all-ongoing': true,
    'show-streak-flags': true,
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === 'get_settings') {
        sendResponse(settings);
    } else {
        settings[req.action] = req.value;
        sendResponse({});
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    // chrome.scripting.insertCSS({
    //     target: { tabId: details.tabId },
    //     files: ['styles/themes.css']
    // });

    if (details.url.includes('/me/current')) {
        if (settings["delete-all-ongoing"]) {
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                files: ['scripts/delete-all-ongoing.js']
            });
        }
    }

    else if (details.url.includes('/game')) {
        if (settings["see-movement-settings"]) {
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                files: ['scripts/show-rules.js']
            });
        }

        if (settings["track-advanced-round"]) {
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                files: ['scripts/more-round-info.js']
            });
        }

        if (settings["show-streak-flags"]) {
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                files: ['scripts/streak-show-flags.js']
            });
        }
    }
});