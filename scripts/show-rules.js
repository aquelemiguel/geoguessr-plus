(async function() {
    const URL_BASE = `https://www.geoguessr.com/api/v3`;
    const game_id = window.location.href.split('/').pop();

    const response = await fetch(`${URL_BASE}/games/${game_id}`);
    const game_info = await response.json();

    const layout_elem = document.querySelector('div.game-statuses');
    
    const rules_tab_elem = document.createElement('div');
    rules_tab_elem.innerHTML = `
        <div class="game-status">
            <div class="game-status__heading">Rules</div>
            <div class="game-status__body" style="margin-top: 0.125rem;">
                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 24" width="16px"
                    fill="${game_info.forbidMoving ? '#c21b1b' : '#bfbfbf'}">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
                </svg>

                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="16px" viewBox="0 0 24 24" width="16px"
                    fill="${game_info.forbidRotating ? '#c21b1b' : '#bfbfbf'}">
                    <g><rect fill="none" height="24" width="24" x="0"/></g>
                    <g><g><path d="M20.5,2v2.02C18.18,2.13,15.22,1,12,1S5.82,2.13,3.5,4.02V2H2v3.5V7h1.5H7V5.5H4.09c2.11-1.86,4.88-3,7.91-3 s5.79,1.14,7.91,3H17V7h3.5H22V5.5V2H20.5z"/><g><path d="M18.89,13.77l-3.8-1.67C14.96,12.04,14.81,12,14.65,12H14l0-4.37c0-1.32-0.96-2.5-2.27-2.62C10.25,4.88,9,6.05,9,7.5 v8.15l-1.87-0.4c-0.19-0.03-1.02-0.15-1.73,0.56L4,17.22l5.12,5.19C9.49,22.79,10,23,10.53,23h6.55c0.98,0,1.81-0.7,1.97-1.67 l0.92-5.44C20.12,15.03,19.68,14.17,18.89,13.77z M18,15.56L17.08,21h-6.55l-3.7-3.78L11,18.11V7.5C11,7.22,11.22,7,11.5,7 S12,7.22,12,7.5v6.18h1.76L18,15.56z"/></g></g></g>
                </svg>

                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 24" width="16px"
                    fill="${game_info.forbidZooming ? '#c21b1b' : '#bfbfbf'}">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z"/>
                </svg>
            </div>
        </div>
    `.trim();

    layout_elem.insertBefore(rules_tab_elem.firstChild, layout_elem.childNodes[1]);
})();