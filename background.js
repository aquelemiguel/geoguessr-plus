const settings = [
    'see-movement-settings',
    'track-advanced-round',
    'delete-all-ongoing',
    'show-streak-flags'
];

function setSetting(name, value) {
    let payload = {};
    payload[name] = value;
    chrome.storage.sync.set(payload);
}

chrome.runtime.onInstalled.addListener(() => {
    settings.forEach(setting => {
        chrome.storage.sync.get(setting, data => {
            if (Object.keys(data).length === 0) {
                setSetting(setting, true);
            }
        });
    });
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    // chrome.scripting.insertCSS({
    //     target: { tabId: details.tabId },
    //     files: ['styles/themes.css']
    // });

    if (details.url.includes('/me/current')) {
        chrome.storage.sync.get('delete-all-ongoing', data => {
            if (data['delete-all-ongoing']) {
                chrome.scripting.executeScript({
                    target: { tabId: details.tabId },
                    files: ['scripts/delete-all-ongoing.js']
                });
            }
        });
    }

    else if (details.url.includes('/game')) {
        chrome.storage.sync.get('see-movement-settings', data => {
            if (data['see-movement-settings']) {
                chrome.scripting.executeScript({
                    target: { tabId: details.tabId },
                    files: ['scripts/show-rules.js']
                });
            }
        });

        chrome.storage.sync.get('track-advanced-round', data => {
            if (data['track-advanced-round']) {
                chrome.scripting.executeScript({
                    target: { tabId: details.tabId },
                    files: ['scripts/more-round-info.js']
                });
            }
        });

        chrome.storage.sync.get('show-streak-flags', data => {
            if (data['show-streak-flags']) {
                chrome.scripting.executeScript({
                    target: { tabId: details.tabId },
                    files: ['scripts/streak-show-flags.js']
                });
            }
        });
    }
});