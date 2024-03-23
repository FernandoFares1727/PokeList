const pokeRange = 900;

const mainUrl = "https://pokeapi.co/api/v2/";
const limitParam = "pokemon?limit=";

const componentsFolder = "./Components/";
const pokeCardFolder = "PokeCard/"
const pokeCardPage = "index.html";
const pokeDetailsFolder = "PokeDetails/";
const pokeDetailsCardPage = "index.html";

const searchs = {
    tagId : "tagId",
    tagName : "tagName"
};

const pokeAtributesLabels = {
    hp : "HP",
    attack : "ATK",
    defense : "DEF",
    specialAttack : "SATK",
    speacialDefense : "SDEF",
    speed : "SPD"
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
        pokeCard.setAttribute('id', pokeData.id);

        pokeCard.addEventListener('click', function() {
            var pokemonId = pokeCard.getAttribute('id');
            showPokeDetails(pokemonId);
        })

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

function showPokeDetails(pokeId)
{
    fetch(mainUrl + "pokemon" + "/" + pokeId + "/")
    .then(response => response.json())
    .then(function(pokeData) {
        createPokemonDetails(pokeData);
    })
}

function createPokemonDetails(pokeData)
{
    fetch(componentsFolder + pokeCardFolder + pokeDetailsFolder + pokeDetailsCardPage)
    .then(response => response.text())
    .then(async html => {

        var pokeDetails = document.createElement('div');
        pokeDetails.classList.add('pokeDetails');

        pokeDetails.innerHTML = html;
        var turnBackButton = pokeDetails.querySelector('button');

        turnBackButton.addEventListener('click', function() {
            removePokeDetails();
        })

        var pokeDetailsName = pokeDetails.querySelector('.pokeDetailsName');
        pokeDetailsName.textContent = pokeData.name;

        var pokeDetailsId = pokeDetails.querySelector('.pokeDetailsId');
        pokeDetailsId.textContent = "#" + pokeData.id;

        var pokeDetailsImage = pokeDetails.querySelector('.pokeDetailsImage').querySelector('img');
        pokeDetailsImage.src = pokeData.sprites.front_default;

        /* construct pokeDetailsCard */

        var pokeDetailsCard = pokeDetails.querySelector('.pokeDetailsCardInfo');
        
        /* construct pokeDetailsTypes */

        var pokeDetailsCardTypes = pokeDetailsCard.querySelector('.pokeDetailsCardTypes');
        var types = pokeData.types;

        types.forEach(type => {
            var pokeDetailsCardTypeElement = document.createElement('p');
            pokeDetailsCardTypeElement.textContent = type.type.name;
            pokeDetailsCardTypes.appendChild(pokeDetailsCardTypeElement);
        })

        /* construct pokeDetailsAtributes */

        var pokeDetailsCardWeight = pokeDetailsCard.querySelector('.pokeDetailsCardWeightValue');
        pokeDetailsCardWeight.textContent = pokeData.weight/10 + "kg";

        var pokeDetailsHeight = pokeDetailsCard.querySelector('.pokeDetailsCardHeightValue');
        pokeDetailsHeight.textContent = pokeData.height/10 + "m";

        var pokeDetailsMoves = pokeDetails.querySelector('.pokeDetailsCardMovesValue');
        var moves = pokeData.moves;

        let count = 0;
        moves.forEach(move => {
            if (count < 3) {
                var pokeDetailsCardMoveElement = document.createElement('p');
                pokeDetailsCardMoveElement.textContent = move.move.name;
                pokeDetailsMoves.appendChild(pokeDetailsCardMoveElement);
                count++;
            } else {
                return; // Exit the loop early
            }
        });

        /* construct description */

        var pokemonDescription = await getPokemonDescription(pokeData.id);
        var pokeDetailsCardDescription = pokeDetailsCard.querySelector('.pokeDetailsCardDescription');
        pokeDetailsCardDescription.textContent = pokemonDescription;

        /* construct base stats */

        var pokeDetailsCardStatsLabels = pokeDetailsCard.querySelector('.pokeDetailsCardStatsLabels');
        var pokeDetailsCardStatsValues = pokeDetailsCard.querySelector('.pokeDetailsCardStatsValues');

        var stats = pokeData.stats;
        const maxStat = 233;

        stats.forEach(stat => {

            var statIndex = stats.indexOf(stat);

            var statLabel = document.createElement('p');
            var statName = getShortPokeAtribute(statIndex);

            statLabel.textContent = statName;
            pokeDetailsCardStatsLabels.appendChild(statLabel);

            var statGrafic = document.createElement('div');
            statGrafic.classList.add('pokeDetailsCardStatsRows');

            var statValue = document.createElement('p');
            statValue.textContent = stat.base_stat;

            var statPercentValue = (stat.base_stat / 233) * 100;

            var statGraficBar = document.createElement('div');
            statGraficBar.style.width = statPercentValue + "%";

            statGrafic.appendChild(statValue);
            statGrafic.appendChild(statGraficBar);

            pokeDetailsCardStatsValues.appendChild(statGrafic);

        })

        document.body.appendChild(pokeDetails);
    })
}

function getShortPokeAtribute(index)
{
    switch(index)
    {
        case 0:
            return pokeAtributesLabels.hp;
        case 1:
            return pokeAtributesLabels.attack;
        case 2: 
            return pokeAtributesLabels.defense;
        case 3:
            return pokeAtributesLabels.specialAttack;
        case 4:
            return pokeAtributesLabels.speacialDefense;
        case 5: 
            return pokeAtributesLabels.speed;
        default:
            return pokeAtributesLabels.hp;
    }
}

function removePokeDetails()
{
    var pokeDetails = document.querySelector('.pokeDetails');
    document.body.removeChild(pokeDetails);
}

async function getPokemonDescription(pokeId) {
  return fetch(mainUrl + "pokemon-species/" + pokeId + "/")
    .then(response => response.json())
    .then(function(result) { 
        return result.flavor_text_entries[0].flavor_text
    });
}