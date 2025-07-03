let typeNames = [];

function displayPokemon(pokemon) {
    let typesBadges = getPokemonTypes(pokemon.types);
    let statsHtml = getPokemonStats(pokemon.stats);
    let movesHtml = getPokemonMoves(pokemon.moves);
    let heightInMeters = (pokemon.height / 10).toFixed(1);
    let weightInKg = (pokemon.weight / 10).toFixed(1);
    let htmlContent = `
        <div class="pokemon-card">
            <div class="card-inner">
                <div class="card-front">
                    <h2 class="pokemon-name">${pokemon.name.toUpperCase()}</h2>
                    <p class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</p>
                    <img class="pokemon-image" 
                         src="${pokemon.sprites.front_default}" 
                         alt="${pokemon.name}">
                    <div class="pokemon-types">
                        ${typesBadges}
                    </div>                 
                    <p style="font-size: 16px; margin-top: 20px;">
                        Hover to see details
                    </p>
                </div>
                <div class="card-back">
                    <div class="card-back-content">
                        <div class="pokemon-details">
                            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">
                                ${pokemon.name.toUpperCase()}
                            </h3>     
                            <div class="physical-types">
                                        ${typesBadges}
                                    </div>                
                            <div class="detail-section">
                                <div class="pokemon-physical">
                                    <div class="physical-row">
                                        <span class="physical-label">Height:</span>
                                        <span class="physical-value">${heightInMeters} m</span>
                                    </div>
                                    <div class="physical-row">
                                        <span class="physical-label">Weight:</span>
                                        <span class="physical-value">${weightInKg} kg</span>
                                    </div>
                                    
                                </div>
                            </div>     
                            <div class="detail-section">
                                <div class="pokemon-stats">
                                    ${statsHtml}
                                </div>
                            </div>
                            <div class="detail-section">
                                <div class="pokemon-moves">
                                    <div class="moves-grid">
                                        ${movesHtml}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    pokemonContainer.innerHTML += htmlContent;
}

function getPokemonTypes(typesArray) {

    let typeBadges = [];   
    for (let i = 0; i < typesArray.length; i++) {
        let typeName = typesArray[i].type.name;
        let badge = `<span class="type-badge type-${typeName}">${typeName}</span>`;
        typeBadges.push(badge);
    }
    
    return typeBadges.join(' ');
}

function getPokemonStats(statsArray) {
    let statsHtml = [];
    for (let i = 0; i < statsArray.length; i++) {
        let stat = statsArray[i];
        let statName = translateStatName(stat.stat.name);
        let statValue = stat.base_stat;
        let barWidth = Math.min((statValue / 200) * 100, 100);  
        let statRow = `
            <div class="stat-row">
                <span class="stat-name">${statName}</span>
                <span class="stat-value">${statValue}</span>
                <div class="stat-bar">
                    <div class="stat-fill" style="width: ${barWidth}%"></div>
                </div>
            </div>
        `;  
        statsHtml.push(statRow);
    }   
    return statsHtml.join('');
}

function getPokemonMoves(movesArray) {
    let movesHtml = [];
    let maxMoves = Math.min(movesArray.length);
    
    for (let i = 0; i < maxMoves; i++) {
        let moveName = movesArray[i].move.name;
        let formattedName = formatMoveName(moveName);
        let moveItem = `<div class="move-item">${formattedName}</div>`;
        movesHtml.push(moveItem);
    }
    
    return movesHtml.join('');
}

function formatMoveName(moveName) {
    return moveName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function translateStatName(englishName) {
    const translations = {
        'hp': 'HP',
        'attack': 'ATK',
        'defense': 'DEF',
        'special-attack': 'SP.ATK',
        'special-defense': 'SP.DEF',
        'speed': 'SPD'
    };   
    return translations[englishName] || englishName.toUpperCase();
}