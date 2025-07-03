const INVALID_POKEMON_IDS = [
];

function isValidPokemonId(id) {
    let numId = parseInt(id);
    if (isNaN(numId)) return true;
    if (numId < 1 || numId > 1010) return false;
    return !INVALID_POKEMON_IDS.includes(numId);
}

async function safeFetch(url) {
    try {
        let response = await fetch(url);
        return response;
    } catch (error) {
        return { ok: false, status: 404 };
    }
}

async function loadPokemon(id) {
    if (!isValidPokemonId(id)) {
        return null;
    }
    
    let response = await safeFetch(API_URL + id);
    if (!response.ok) {
        return null;
    }    
    let pokemon = await response.json();
    return pokemon;
}

async function loadMultiplePokemon(startId, count, clearContainer = false) {
    if (clearContainer) {
        pokemonContainer.innerHTML = '';
    }
    
    for (let i = 0; i < count; i++) {
        let currentId = startId + i;
        let pokemon = await loadPokemon(currentId);
        if (pokemon) {
            displayPokemon(pokemon);
        }
    }
}