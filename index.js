
import 
{
    mainUrl,
    componentsFolder,
    pokeCardFolder,
    pokeCardPage,
    pokeDetailsFolder,
    pokeDetailsCardPage
} from "./Modules/urlsModule.js";

import 
{
    getShortPokeAtribute,
    getPokeCardColor
} from "./Modules/attributesModule.js";

import 
{
    clearSearchInput,
    getLocalSearch,
    setLocalSearch,
    searchPokemon,
    changeSearch,
} from "./Modules/searchModule.js";

import 
{
    pokeByPage,
    maxPokemons,
    getLocalPage,
    setLocalPage,
    getMaxPages
} from "./Modules/pageModule.js";

import hexToRGBA from "./Modules/hexToRGBAModule.js";
import getPokemonDescription from "./Modules/getPokemonDescriptionModule.js";

loadPage();

function loadPage()
{
    var localPage = getLocalPage();
    var localSearch = getLocalSearch();
    enableButtonEvents();
    setLocalSearch(localSearch);
    enableInput(false);
    createPageSelect(localPage);
    getPokemonList(localPage);
    searchPokemon();
    enableInput(true);
}

function enableButtonEvents()
{
    var search = document.querySelector('#search').querySelector('button');
    search.addEventListener('click', function () {
        changeSearch();
    })
}

function enableInput(enable)
{
    var searchInput = document.querySelector('#search').querySelector('input');
    searchInput.disabled = !enable;
}

function createPageSelect(localPage)
{
    var pageSelect = document.querySelector('#page');
    var maxPage = getMaxPages();

    for (let i = 0; i < maxPage; i++)
    {
        var actualOption = i + 1;
        var option = document.createElement('option');
        option.textContent = actualOption;
        option.value = actualOption;

        if (actualOption == localPage)
            option.selected = true;

        pageSelect.appendChild(option);
    }

    pageSelect.addEventListener('change', function (event) {

        clearSearchInput();

        var selectedPage = event.target.value;
        removePokeCards();
        setLocalPage(selectedPage);
        getPokemonList(selectedPage);
    })
}

async function getPokemonList(page = 1)
{
    var minInterval = page > 1 
                    ? 1 + (pokeByPage * (page -1)) 
                    : 1;    

    var progressBar = document.createElement('div');
    progressBar.classList.add('loader');
    document.body.appendChild(progressBar);

    var promisses = [];

    for (let i = 0; i < pokeByPage; i++)
    {
        if (minInterval > maxPokemons)
            break;
        promisses.push(fetchPokemonData(minInterval));
        minInterval++;
    }

    await Promise.all(promisses);
    document.body.removeChild(progressBar);
}

function fetchPokemonData(pokemonId){
    //var url = pokemon.url // <--- this is saving the pokemon url to a      variable to us in a fetch.(Ex: https://pokeapi.co/api/v2/pokemon/1/)
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;

    return fetch(url)
      .then(response => response.json())
      .then(pokeData => {
        createPokemonCard(pokeData);
        return pokeData; // Return the Pokemon data for potential further use
    })
}

function createPokemonCard(pokeData)
{
    var pokeList = document.querySelector('#pokeList');

    return fetch(componentsFolder + pokeCardFolder + pokeCardPage)
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
            var isDisabled = pokeCard.disabled;
            if (isDisabled == true)
                return;

            var pokemonId = pokeCard.getAttribute('id');
            showPokeDetails(pokemonId);
            pokeCardsDisabled(true);
        })

        pokeList.appendChild(pokeCard);
    })
}

function showPokeDetails(pokeId)
{
    fetch(`${mainUrl}/pokemon/${pokeId}/`)
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

        document.body.addEventListener('click', handleOutsideClick);

        // Function to handle clicks outside of pokeDetails
        function handleOutsideClick(event) {
          if (!pokeDetails.contains(event.target)) {
            removePokeDetails();
            document.body.removeEventListener('click', handleOutsideClick);
          }
        }

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

        var pokeDetailsCardMainType = types[0].type.name;
        pokeDetails.setAttribute('mainType', pokeDetailsCardMainType);

        var mainTypeColor = getPokeCardColor(pokeDetailsCardMainType);
        pokeDetails.style.backgroundColor = mainTypeColor;

        types.forEach(type => {
            var pokeDetailsCardTypeElement = document.createElement('p');
            var typeName = type.type.name;
            pokeDetailsCardTypeElement.textContent = typeName;
            var typeColor = getPokeCardColor(typeName);
            pokeDetailsCardTypeElement.style.backgroundColor = typeColor;
            pokeDetailsCardTypes.appendChild(pokeDetailsCardTypeElement);
        })

        var pokeDetailsCardAbout = pokeDetails.querySelector('.about');
        pokeDetailsCardAbout.style.color = mainTypeColor;

        /* construct pokeDetailsAtributes */

        var pokeDetailsCardWeight = pokeDetailsCard.querySelector('.pokeDetailsCardWeightValue');
        pokeDetailsCardWeight.textContent = pokeData.weight/10 + "kg";

        var pokeDetailsHeight = pokeDetailsCard.querySelector('.pokeDetailsCardHeightValue');
        pokeDetailsHeight.textContent = pokeData.height/10 + "m";

        /*var pokeDetailsMoves = pokeDetails.querySelector('.pokeDetailsCardMovesValue');
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
        });*/

        /* construct description */

        var pokemonDescription = await getPokemonDescription(pokeData.id);
        var pokeDetailsCardDescription = pokeDetailsCard.querySelector('.pokeDetailsCardDescription');
        pokeDetailsCardDescription.textContent = pokemonDescription;

        /* construct base stats */

        var pokeDetailsCardStats = pokeDetails.querySelector('.stats');
        pokeDetailsCardStats.style.color = mainTypeColor;

        var pokeDetailsCardStatsLabels = pokeDetailsCard.querySelector('.pokeDetailsCardStatsLabels');
        var pokeDetailsCardStatsValues = pokeDetailsCard.querySelector('.pokeDetailsCardStatsValues');

        var stats = pokeData.stats;
        const maxStat = 233;

        stats.forEach(stat => {

            var statIndex = stats.indexOf(stat);

            var statLabel = document.createElement('p');
            var statName = getShortPokeAtribute(statIndex);

            statLabel.textContent = statName;
            statLabel.style.color = mainTypeColor;
            pokeDetailsCardStatsLabels.appendChild(statLabel);

            var statGrafic = document.createElement('div');
            statGrafic.classList.add('pokeDetailsCardStatsRows');

            var statValue = document.createElement('p');
            statValue.textContent = stat.base_stat;

            var statPercentValue = (stat.base_stat / 233) * 100;

            var statGraficBar = document.createElement('div');
            statGraficBar.classList.add('statGraficBar');
            var statGraficBarContent = document.createElement('div');
            
            statGraficBar.style.width = 100 + "%";
            statGraficBar.style.background = hexToRGBA(mainTypeColor);
            
            statGraficBarContent.style.width = statPercentValue + "%";
            statGraficBarContent.style.background = mainTypeColor;
            
            statGraficBar.appendChild(statGraficBarContent);

            statGrafic.appendChild(statValue);
            statGrafic.appendChild(statGraficBar);

            pokeDetailsCardStatsValues.appendChild(statGrafic);
        })

        document.body.appendChild(pokeDetails);
    })
}

function removePokeCards()
{
    var pokeList = document.querySelector('#pokeList');
    var pokeCards = document.querySelectorAll('.pokeCard');

    pokeCards.forEach(pokeCard => {
        pokeList.removeChild(pokeCard);
    })
}

function removePokeDetails()
{
    var pokeDetails = document.querySelector('.pokeDetails');
    document.body.removeChild(pokeDetails);

    pokeCardsDisabled(false);
}

function pokeCardsDisabled(disable)
{
    var pokeCards = document.querySelectorAll('.pokeCard');
    pokeCards.forEach(pokeCard => {
        pokeCard.disabled = disable;
    })
}