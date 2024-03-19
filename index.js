const pokeRange = 900;

const mainUrl = "https://pokeapi.co/api/v2/";
const limitParam = "pokemon?limit=";

const componentsFolder = "./Components/";
const pokeCardFolder = "PokeCard/"
const pokeCardPage = "index.html";

const searchs = {
    tagId : "tagId",
    tagName : "tagName"
};

loadPage();

function loadPage()
{
    enableInput(false);
    getPokemonList(pokeRange);
    searchPokemon();
    enableInput(true);
}

function enableInput(enable)
{
    var searchInput = document.querySelector('#search').querySelector('input');
    searchInput.disabled = !enable;
}

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

function searchPokemon()
{
    var searchInput = document.querySelector('#search').querySelector('input');

    searchInput.addEventListener("input", function() {
        var valueInput = searchInput.value.trim().toLowerCase();
        var actualSearch = document.querySelector('#search').querySelector('button').querySelector('img').getAttribute('id');

        var pokeCards = document.querySelectorAll('.pokeCard');

        if (valueInput == '')
        {
            pokeCards.forEach(pokeCard => {
                pokeCard.style.display = "block";
            })
        }

        else if (actualSearch == searchs.tagId)
        {
            pokeCards.forEach(pokeCard => {
                const pokeCardId = pokeCard.querySelector('.pokeId').textContent.replace('#','');
                const isVisible = pokeCardId == valueInput;
                pokeCard.style.display = isVisible ? "block" : "none";
            })
        }

        else if (actualSearch == searchs.tagName)
        {
            valueInput = valueInput
            pokeCards.forEach(pokeCard => {
                const pokeName = pokeCard.querySelector('.pokeName').textContent.toLowerCase();
                const isVisible = pokeName.includes(valueInput);
                pokeCard.style.display = isVisible ? "block" : "none";
            })
        }
    })
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

    fetch(componentsFolder + pokeCardFolder + pokeCardPage)
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

function changeSearch(element)
{
    var img = element.querySelector('img');
    var actualSearch = img.getAttribute('id');

    if (actualSearch == searchs.tagId)
    {
        img.src = "./images/tagName.svg";
        img.setAttribute('id',searchs.tagName);
    }
    else
    {
        img.src = "./images/tag.svg";
        img.setAttribute('id', searchs.tagId);
    }
}