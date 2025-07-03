const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
let pokemonContainer = null;
let loadingContainer = null;
const INITIAL_POKEMON_COUNT = 25;
const MAX_POKEMON_ID = 1010;
let currentPokemonCount = 0;

function initializeContainer() {
    pokemonContainer = document.getElementById('pokemon-container');
}

function initializeLoading() {
    loadingContainer = document.getElementById('loading-container');
}

function showLoading(message = 'Loading Pokemon...') {
    loadingContainer.innerHTML = `
        <div class="loading-overlay">
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
    
    loadingContainer.style.display = 'block';
}

function hideLoading() {    
    loadingContainer.style.display = 'none';
    loadingContainer.innerHTML = '';
}

async function render() {    
    initializeContainer();
    initializeLoading();
    initSearch();
    showLoading(`Loading first ${INITIAL_POKEMON_COUNT} Pokemon...`);
    await loadMultiplePokemon(1, INITIAL_POKEMON_COUNT, true);
    hideLoading();
    currentPokemonCount = INITIAL_POKEMON_COUNT;
}

async function loadMorePokemon() {    
    let nextStartId = currentPokemonCount + 1;
    let nextCount = 20;

    if (nextStartId > MAX_POKEMON_ID) {
        document.getElementById('load-more-btn').textContent = 'All Pokemon Loaded!';
        document.getElementById('load-more-btn').disabled = true;
        return;
    }
    
    showLoading(`Loading Pokemon ${nextStartId} - ${nextStartId + nextCount - 1}...`);
    document.getElementById('load-more-btn').disabled = true;
    await loadMultiplePokemon(nextStartId, nextCount, false);
    hideLoading();
    document.getElementById('load-more-btn').disabled = false;
    currentPokemonCount += nextCount;
}

function backToHome() {
    exitSearchMode();
    showLoading('Loading Pokemon...');
    pokemonContainer.innerHTML = '';
    loadMultiplePokemon(1, INITIAL_POKEMON_COUNT, false).then(() => {
        currentPokemonCount = INITIAL_POKEMON_COUNT;
        hideLoading();
    });
}
