let searchDropdown = null;
let isInSearchMode = false;
const POKEMON_NAMES = [
    "bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard",
    "squirtle", "wartortle", "blastoise", "caterpie", "metapod", "butterfree",
    "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata",
    "raticate", "spearow", "fearow", "ekans", "arbok", "pikachu", "raichu",
    "sandshrew", "sandslash", "nidoran-f", "nidorina", "nidoqueen", "nidoran-m",
    "nidorino", "nidoking", "clefairy", "clefable", "vulpix", "ninetales",
    "jigglypuff", "wigglytuff", "zubat", "golbat", "oddish", "gloom", "vileplume",
    "paras", "parasect", "venonat", "venomoth", "diglett", "dugtrio", "meowth",
    "persian", "psyduck", "golduck", "mankey", "primeape", "growlithe", "arcanine"
];

function initializeSearchDropdown() {
    searchDropdown = document.getElementById('search-dropdown');
}

async function searchPokemon() {
    let searchInput = document.getElementById('search');
    let searchValue = searchInput.value.toLowerCase().trim();
  
    if (searchValue === '') {
      return;
    }
    if (!POKEMON_NAMES.includes(searchValue) && isNaN(parseInt(searchValue))) {
      enterSearchMode();
      pokemonContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <h2 style="color: #2F66B1;">Pokemon not found!</h2>
          <p>No Pokemon named "${searchValue}" was found.</p>
          <p>Try searching for:</p>
          <ul style="list-style: none; padding: 0;">
            <li>• <strong>pikachu</strong></li>
            <li>• <strong>charizard</strong></li>
            <li>• <strong>bulbasaur</strong></li>
            <li>• Or use Pokemon ID (1–1010)</li>
          </ul>
        </div>
      `;
      return;
    }
    hideSearchDropdown();
    enterSearchMode();
    showLoading(`Searching for "${searchValue}"...`);
    try {
      let pokemon = await loadPokemonSafely(searchValue);
      if (pokemon) {
        pokemonContainer.innerHTML = '';
        displayPokemon(pokemon);
      } else {
        pokemonContainer.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #666;">
            <h2 style="color: #2F66B1;">Pokemon not found!</h2>
            <p>No Pokemon named "${searchValue}" was found.</p>
            <p>Try searching for:</p>
            <ul style="list-style: none; padding: 0;">
              <li>• <strong>pikachu</strong></li>
              <li>• <strong>charizard</strong></li>
              <li>• <strong>bulbasaur</strong></li>
              <li>• Or use Pokemon ID (1–1010)</li>
            </ul>
          </div>
        `;
      }
    } catch (error) {
      pokemonContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <h2 style="color: #2F66B1;">Search Error</h2>
          <p>Something went wrong. Please try again.</p>
        </div>
      `;
    } finally {
      hideLoading();
    }
  }

async function loadPokemonSafely(nameOrId) {
    try {
        let apiUrl = API_URL + nameOrId;
        let response = await safeFetch(apiUrl);
        if (response.ok) {
            let pokemonData = await response.json();
            return pokemonData;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

function showAutocomplete(searchTerm) {
    if (searchTerm.length < 3) {
        hideSearchDropdown();
        return;
    }
    let matches = POKEMON_NAMES.filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (matches.length === 0) {
        hideSearchDropdown();
        return;
    }
    let dropdownHtml = '';
    let maxResults = Math.min(matches.length, 6);
    for (let i = 0; i < maxResults; i++) {
        let pokemonName = matches[i];
        let pokemonId = POKEMON_NAMES.indexOf(pokemonName) + 1;
        dropdownHtml += `
            <div class="dropdown-item" onclick="selectPokemon('${pokemonName}')">
                <span class="dropdown-pokemon-id">#${pokemonId.toString().padStart(3, '0')}</span>
                <span class="dropdown-pokemon-name">${pokemonName}</span>
            </div>
        `;
    }
    if (matches.length > 6) {
        dropdownHtml += `
            <div style="padding: 8px 15px; font-style: italic; color: #666; font-size: 12px; text-align: center; border-top: 1px solid #eee;">
                +${matches.length - 6} more results...
            </div>
        `;
    }
    searchDropdown.innerHTML = dropdownHtml;
    searchDropdown.style.display = 'block';
}

function hideSearchDropdown() {
    if (searchDropdown) {
        searchDropdown.style.display = 'none';
        searchDropdown.innerHTML = '';
    }
}

function selectPokemon(pokemonName) {
    let searchInput = document.getElementById('search');
    searchInput.value = pokemonName;
    hideSearchDropdown();
    searchPokemon();
}

function enterSearchMode() {
    isInSearchMode = true;
    document.getElementById('load-more-container').style.display = 'none';
    document.getElementById('back-home-container').style.display = 'block';
}

function exitSearchMode() {
    isInSearchMode = false;
    document.getElementById('load-more-container').style.display = 'block';
    document.getElementById('back-home-container').style.display = 'none';
    document.getElementById('search').value = '';
    hideSearchDropdown();
}

function initSearch() {
    let searchInput = document.getElementById('search');
    initializeSearchDropdown();
    searchInput.addEventListener('input', function (event) {
        let searchValue = event.target.value.trim();
        if (searchValue.length >= 3) {
            showAutocomplete(searchValue);
        } else {
            hideSearchDropdown();
        }
    });
    searchInput.onkeypress = function (event) {
        if (event.key === 'Enter') {
            searchPokemon();
        }
    };
    document.addEventListener('click', function (event) {
        if (!event.target.closest('#search') && !event.target.closest('#search-dropdown')) {
            hideSearchDropdown();
        }
    });
}
