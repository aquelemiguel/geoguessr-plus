(async function() {
    const game_id = window.location.href.split('/').pop();
    const response = await fetch(`https://www.geoguessr.com/api/v3/games/${game_id}`);
    const game = await response.json();

    const canvas_elem = document.querySelector('div.game-layout__canvas');
    
    function create_flag(country_code) {
        const flag_elem = document.createElement('div');
        
        flag_elem.innerHTML = `
            <div class="streak-result-list__flag-circle" 
                style="margin: 0; margin-right: 0.5em; width: 1rem; height: 1rem; box-shadow: 1px 2px 5px lightgrey;">
                <img src="/static/flags/${country_code.toUpperCase()}.svg">
            </div>
        `.trim();

        return flag_elem.firstChild;
    }

    /**
     * Ensure this isn't running on US state streak mode.
     * Support coming soon!
     */
    if (game.map === 'us-state-streak') {
        return;
    }

    /**
     * Listen for game score change and request the game state.
     */
    let observer = new MutationObserver(async mutations => {
        const no_flags_yet_elem = document.querySelector('div#no-flags-yet');
        if (no_flags_yet_elem) { no_flags_yet_elem.remove() };

        const response = await fetch(`https://www.geoguessr.com/api/v3/games/${game_id}`);
        const game = await response.json();

        const flags_container = document.querySelector('div.game-statuses > div.flags');
        const guessed_country = game.player.guesses[parseInt(mutations[0].target.textContent - 1)].streakLocationCode;

        flags_container.appendChild(create_flag(guessed_country));
    });

    observer.observe(document.querySelector('div.game-statuses > div:first-child'), {
        subtree: true,
        characterData: true,
    });

    const flag_elems = game.player.guesses.map(guess => create_flag(guess.streakLocationCode).outerHTML);

    const flag_container = document.createElement('div');
    flag_container.innerHTML = `
        <div class="game-layout__status" 
            style="display: flex; position: absolute; z-index: 1; left: 2rem;">
            <div class="game-statuses">
                <div class="game-status" style="padding: 0; border: none;">
                    <div class="game-status__heading">Previous guesses</div>
                </div>
                <div class="flags" style="display: flex;">
                    ${flag_elems.length > 0 ? 
                        flag_elems.join('') : 
                        '<div class="game-status__body" id="no-flags-yet" style="flex: 1; text-align: center;">N/A</div>'}
                </div>
            </div>
        </div>
    `.trim();

    canvas_elem.appendChild(flag_container.firstChild);
})();