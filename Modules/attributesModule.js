
const pokeAtributesLabels = {
    hp : "HP",
    attack : "ATK",
    defense : "DEF",
    specialAttack : "SATK",
    speacialDefense : "SDEF",
    speed : "SPD"
};

const pokeTypeColors = {
    normal: "#AAA67F",
    fighting: "#C12239",
    flying: "A891EC",
    ground: "#DEC16B",
    poison: "#A43E9E",
    rock: "#B69E31",
    bug: "#A7B723",
    ghost: "#70559B",
    steel: "#B7B9D0",
    fire: "#F57D31",
    water: "#6493EB",
    grass: "#74CB48",
    eletric: "#F9CF30",
    psychic: "#FB5584",
    ice: "#9AD6DF",
    dragon: "#7037FF",
    dark: "#75574C",
    fairy: "#E69EAC"
}

export function getShortPokeAtribute(index)
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

export function getPokeCardColor(type)
{
    switch(type){
        case "normal":
            return pokeTypeColors.normal;
        case "fighting":
            return pokeTypeColors.fighting;
        case "flying":
            return pokeTypeColors.flying;
        case "ground":
            return pokeTypeColors.ground;
        case "poison":
            return pokeTypeColors.poison;
        case "rock":
            return pokeTypeColors.rock;
        case "bug":
            return pokeTypeColors.bug;
        case "ghost":
            return pokeTypeColors.ghost;
        case "steel":
            return pokeTypeColors.steel;
        case "fire":
            return pokeTypeColors.fire;
        case "water":
            return pokeTypeColors.water;
        case "grass":
            return pokeTypeColors.grass;
        case "electric":
            return pokeTypeColors.eletric;
        case "psychic":
            return pokeTypeColors.psychic;
        case "ice":
            return pokeTypeColors.ice;
        case "dragon":
            return pokeTypeColors.dragon;
        case "dark":
            return pokeTypeColors.dark;
        case "fairy":
            return pokeTypeColors.fairy;
        default:
            return pokeTypeColors.normal;   
    }
}