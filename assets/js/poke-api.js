const pokeApi = {}
let pokeDetails = undefined;

function convertPokeApiDetailToPokemon(pokeDetail) {
    pokeDetails = pokeDetail;
    const pokemon = new Pokemon()
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    let status = {}

    pokeDetails.stats.forEach(stateSlot => status[stateSlot.stat.name] = stateSlot.base_stat)

    pokemon.name = pokeDetail.name
    pokemon.number = pokeDetail.id
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    pokemon.status = status
    pokemon.types = types
    pokemon.type = type

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
