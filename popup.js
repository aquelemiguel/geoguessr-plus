document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: 'get_settings' }, res => {
        for (let elem of document.getElementsByClassName('setting-toggle')) {
            elem.checked = res[elem.id];
        }
    });
});

for (let elem of document.getElementsByClassName('setting-toggle')) {
    elem.addEventListener('change', (evt) => {
        const message = {
            action: elem.id,
            value: evt.target.checked
        }
    
        chrome.runtime.sendMessage(message, response => {
            console.log(response);
        });
    });
}