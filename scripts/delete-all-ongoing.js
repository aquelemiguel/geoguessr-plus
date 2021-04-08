(function() {
    const URL_BASE = `https://www.geoguessr.com/api/v3/social/events/unfinishedgames`;
    let template = document.createElement('div');

    template.innerHTML = `
        <div style="display: flex; justify-content: flex-end; padding-right: 1rem; margin-bottom: 1rem;">
            <button
                id="delete-all-btn"
                class="button button--small button--danger margin--right-small"
                style="float: right">
                Delete all
            </button>
        </div>
    `.trim();

    const container_elem = document.getElementsByClassName('container__content')[0];

    if (!container_elem) {
        return;
    }

    container_elem.insertBefore(template.firstChild, container_elem.children[2]);

    let confirm_dlg_elem = document.createElement('section');
    confirm_dlg_elem.innerHTML = `
        <section class="confirmation-dialog">
            <div class="confirmation-dialog__content">
                <h2 class="confirmation-dialog__title heading-2">Are you sure?</h2>
                <div class="confirmation-dialog__body">
                    <span style="color: #568209"><b>Geoguessr Plus</b></span> found
                    <span id="ongoing_label"><b>...</b></span>
                    ongoing games.<br>Do you want to delete all?
                </div>
                <div class="buttons confirmation-dialog__actions">
                    <button class="button button--medium button--primary confirmation-dialog__action" type="button" data-qa="confirmation-dialog-continue">
                        <span class="button__animation"></span>
                        <span class="button__label">Yes</span>
                    </button>
                    <button class="button button--medium button--secondary confirmation-dialog__action" type="button" data-qa="confirmation-dialog-cancel">
                        <span class="button__animation"></span>
                        <span class="button__label">Cancel</span>
                    </button>
                </div>
            </div>
        </section>
    `.trim();

    async function deleteAllOngoingGames(tokens) {
        tokens.forEach(async token => {
            await fetch(`${URL_BASE}/${token}`, { method: 'DELETE' });
        });
    }

    document.getElementById('delete-all-btn').addEventListener('click', async () => {
        const main_container = document.getElementById('__next')
        main_container.appendChild(confirm_dlg_elem);

        let response = await fetch(`${URL_BASE}?offset=&limit=10000`);
        let ongoing = await response.json();

        // Update dialog text with ongoing games count
        document.querySelector('span#ongoing_label > b').innerHTML = ongoing.games.length;

        document.querySelector('section.confirmation-dialog button.button--primary').addEventListener('click', async () => {
            await deleteAllOngoingGames(ongoing.games.map(g => g.token));
            window.location.reload();
        });

        document.querySelector('section.confirmation-dialog button.button--secondary').addEventListener('click', async () => {
            main_container.removeChild(confirm_dlg_elem);
        }, { once: true });
    });
})();