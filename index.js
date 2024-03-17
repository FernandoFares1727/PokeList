const pokeRange = 700;

const mainUrl = "https://pokeapi.co/api/v2/";
const limitParam = "pokemon?limit=";

const componentsFolder = "./Components/";
const pokeCardPage = "pokeCard.html";

//const pokeInfo = "pokemon//"

getPokemonList(pokeRange);

function getPokemonList(pokeRange)
{
    fetch(mainUrl + limitParam + pokeRange)
    .then(response => response.json())
    .then(function(allpokemon) {
        allpokemon.results.forEach(function(pokemon){
            fetchPokemonData(pokemon);
          })
    });
}

function fetchPokemonData(pokemon){
    var url = pokemon.url // <--- this is saving the pokemon url to a      variable to us in a fetch.(Ex: https://pokeapi.co/api/v2/pokemon/1/)
    fetch(url)
    .then(response => response.json())
    .then(function(pokeData){
        createPokemonCard(pokeData);
    });
}

function createPokemonCard(pokeData)
{
    var pokeList = document.querySelector('#pokeList');

    fetch(componentsFolder + pokeCardPage)
    .then(response => response.text())
    .then(html => {

        var pokeCard = document.createElement('li');
        pokeCard.classList.add('pokeCard');

        pokeCard.innerHTML = html;
        var pokeName = pokeCard.querySelector('.pokeName');
        var pokeId = pokeCard.querySelector('.pokeId');
        var pokeImg = pokeCard.querySelector('img');

        pokeName.textContent = pokeData.name;
        pokeId.textContent = "#" + pokeData.id;
        pokeImg.src = pokeData.sprites.front_default;


        pokeCard.style.order = pokeData.id;
        pokeList.appendChild(pokeCard);
    })
}