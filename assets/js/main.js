const cardDetail = document.getElementById('cardDetail')
const pagination = document.getElementById('pagination')
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonDetailList = []

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    pokemonDetailList.push(pokemon)
    return `
        <li class="pokemon ${pokemon.type}" onClick="showPokemonDetail(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function updatePokemonDetail(pokemonId) {
    const pokemonDetail = pokemonDetailList.find((pokemon) => pokemon.number === pokemonId)
    const newHtml = `
        <div class="body pokemon ${pokemonDetail.type}">
            <button id="backToList" type="button" onclick="showPokemonList()">Home</button>
            <div class="header">
                <div class="label">
                    <div class="name">${pokemonDetail.name}</div>
                    <div class="number">#${pokemonDetail.number}</div>
                </div>
                <div class="types">
                    ${pokemonDetail.types.map((type) => `<div class="type ${type}">${type}</div>`).join('')}
                </div>
            </div>
            <div class="center">
                <button class="previous" onclick="handleChangePokemonInDetail(${pokemonDetail.number}-1)"><</button>
                <img src="${pokemonDetail.photo}" alt="image of ${pokemonDetail.name}">
                <button class="next" onclick="handleChangePokemonInDetail(${pokemonDetail.number}+1)">></button>
            </div>
            <div class="footer">
                <div class="status">
                    <div>
                        <div class="attribute">
                            <div class="name">ATK</div>
                            <div class="value">${pokemonDetail.status['attack']}</div>
                        </div>
                        <div class="attribute">
                            <div class="name">DEF</div>
                            <div class="value">${pokemonDetail.status['defense']}</div>
                        </div>
                        <div class="attribute">
                            <div class="name">HP</div>
                            <div class="value">${pokemonDetail.status['hp']}</div>
                        </div>
                    </div>
                    <div class="separator"></div>
                    <div>
                        <div class="attribute">
                            <div class="name">SATK</div>
                            <div class="value">${pokemonDetail.status['special-attack']}</div>
                        </div>
                        <div class="attribute">
                            <div class="name">SDEF</div>
                            <div class="value">${pokemonDetail.status['special-defense']}</div>
                        </div>
                        <div class="attribute">
                            <div class="name">SPD</div>
                            <div class="value">${pokemonDetail.status['speed']}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    cardDetail.innerHTML = newHtml
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function handleChangePokemonInDetail(id) {
    const firstId = pokemonDetailList[0].number ;
    const lastId = pokemonDetailList[pokemonDetailList.length - 1].number;

    if (id < firstId) {
        updatePokemonDetail(lastId)
    } else if (id > lastId) {
        updatePokemonDetail(firstId)
    } else {
        updatePokemonDetail(id)
    }
}

function showPokemonDetail(id) {
    cardDetail.className = 'cardDetail'
    pagination.className = 'pagination hidePagination'
    pokemonList.className = 'pokemons hidePokemonList'
    updatePokemonDetail(id)
}

function showPokemonList() {
    cardDetail.className = 'cardDetail hideCardDetail'
    pagination.className = 'pagination'
    pokemonList.className = 'pokemons'
}
