(async function() {
    const game_id = window.location.href.split('/').pop();
    const response = await fetch(`https://www.geoguessr.com/api/v3/games/${game_id}`);
    const game = await response.json();

    /**
     * Ensure this isn't running on US state streak mode.
     * Support coming soon!
     */
    if (game.mode === 'standard') {
        return;
    }

    const is_country_streak = game.map === 'country-streak';
    const canvas_elem = document.querySelector('div.game-layout__canvas');
    
    function create_flag(country_code) {
        const flag_elem = document.createElement('div');
        
        flag_elem.innerHTML = `
            <div class="streak-result-list__flag-circle" 
                style="margin: 0; margin-right: 0.5em; width: 1.25rem; height: 1.25rem; box-shadow: 1px 2px 5px lightgrey;">
                <img src="/static/${is_country_streak ? 'flags' : 'us-states'}/${country_code.toUpperCase()}.svg"
                    ${!is_country_streak ? 'class="us-state" style="padding: 0.1rem;"': ''}>
            </div>
        `.trim();

        return flag_elem.firstChild;
    }

    async function inject_flags() {
        const response = await fetch(`https://www.geoguessr.com/api/v3/games/${game_id}`);
        const game = await response.json();

        /**
         * Don't inject the component if the player hasn't guessed yet.
         */
        if (game.player.guesses.length === 0) {
            return;
        }

        /**
         * If the element is already there, delete it and reinject it.
         */
        document.querySelector('div.flag-container')?.remove();

        let flag_elems = game.player.guesses.map(guess => create_flag(guess.streakLocationCode).outerHTML);
        flag_elems = flag_elems.reverse().slice(Math.min(flag_elems.length - 2, 7));

        const flag_container = document.createElement('div');
        flag_container.innerHTML = `
            <div class="game-layout__status flag-container" 
                style="display: flex; position: absolute; z-index: 1; left: 2rem;">
                <div class="game-statuses">
                    <div class="game-status" style="padding: 0; border: none;">
                        <div class="game-status__heading">Previous guesses</div>
                    </div>
                    <div class="flags" style="display: flex;">
                        ${flag_elems.join('')}
                    </div>
                </div>
            </div>
        `.trim();

        canvas_elem.appendChild(flag_container.firstChild);
    }

    /**
     * Listen for game score change and request the game state.
     */
    let observer = new MutationObserver(async _mutations => {
        inject_flags();
    });

    observer.observe(document.querySelector('div.game-statuses > div:first-child'), {
        subtree: true,
        characterData: true,
    });

    inject_flags();
})();