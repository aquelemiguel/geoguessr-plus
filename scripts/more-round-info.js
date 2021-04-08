(async function() {
    const URL_BASE = `https://www.geoguessr.com/api/v3`;
    const game_id = window.location.href.split('/').pop();

    let response = await fetch(`${URL_BASE}/games/${game_id}`);
    const game_info = await response.json();

    /**
     * Right now, don't inject this into streak games.
     */
    if (game_info.mode !== 'standard') {
        return;
    }

    response = await fetch(`https://www.geoguessr.com/api/v3/profiles/`);
    const profile_info = await response.json();

    function parse_round_info(guess) {
        let score = parseInt(guess.roundScore.amount).toLocaleString('en-US');

        let distance = profile_info.distanceUnit === 0 ?
            `${guess.distance.meters.amount} ${guess.distance.meters.unit}` :
            `${guess.distance.miles.amount} ${guess.distance.miles.unit}`

        let round_seconds_date = new Date(0);
        round_seconds_date.setSeconds(guess.time);
        let time = round_seconds_date.toISOString().substr(11, 8);

        return { score, distance, time };
    }

    const layout_elem = document.querySelector('div.game-layout__status');
    
    /**
     * Style default game statuses.
     */
    layout_elem.firstElementChild.style = `display: flex; white-space: nowrap;`;
    document.querySelectorAll('div.game-status').forEach(status => {
        status.style = `flex: 1;`;
    });

    /**
     * Listen for game score change and request the game state.
     */
    let observer = new MutationObserver(async _mutations => {
        const response = await fetch(`${URL_BASE}/games/${game_id}`);
        const game_info = await response.json();

        const guess = parse_round_info(game_info.player.guesses[game_info.round - 2]);
        const round_elem = document.querySelector(`div#round${game_info.round - 1}-details`);

        round_elem.children[1].innerHTML = guess.score;
        round_elem.children[2].innerHTML = `${guess.distance} | ${guess.time}`
    });

    observer.observe(document.querySelector('div.game-statuses > div:last-child'), {
        subtree: true,
        characterData: true,
    });

    const statuses_elem = document.createElement('div');
    statuses_elem.innerHTML = `
        <div class="game-statuses" id="advanced-round-statuses" 
            style="display: flex; margin-top: 1rem;"
        >
        </div>`.trim();

    for (let i = 1; i <= 4; i++) {
        const round_info = document.createElement('div');

        const guess_dict = game_info.player.guesses[i-1];
        const guess = guess_dict ? parse_round_info(guess_dict) : undefined;

        round_info.innerHTML = `
            <div class="game-status" id="round${i}-details" data-qa="score"
                style="flex: 1; white-space: nowrap;">
                <div class="game-status__heading">
                    Round ${i}
                </div>
                <div class="game-status__body score-label">
                    ${guess ? guess.score : '-'}
                </div>
                <div class="extra-label" style="font-size: 8px;">
                    ${guess ? `${guess.distance} | ${guess.time}h` : 'TBD'}
                </div>
            </div>
        `.trim();

        statuses_elem.firstChild.appendChild(round_info.firstChild);
    }
    layout_elem.appendChild(statuses_elem.firstChild);
})();