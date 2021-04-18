function toggleSetting(name, value) {
    let payload = {};
    payload[name] = value;
    chrome.storage.sync.set(payload);
}

document.addEventListener('DOMContentLoaded', () => {
    for (let elem of document.getElementsByClassName('setting-toggle')) {
        chrome.storage.sync.get(elem.id, res => {
            if (Object.keys(res).length === 0) {
                toggleSetting(elem.id, true);
                elem.checked = true;
            } else {
                elem.checked = res[elem.id];
            }
        });
    }
});

for (let elem of document.getElementsByClassName('setting-toggle')) {
    elem.addEventListener('change', (evt) => {
        toggleSetting(elem.id, evt.target.checked);
    });
}