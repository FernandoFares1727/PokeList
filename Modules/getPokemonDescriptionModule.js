
import 
{
    mainUrl
} from "./urlsModule.js";

const language = "en";

export default async function getPokemonDescription(pokeId) {
    return fetch(mainUrl + "pokemon-species/" + pokeId + "/")
      .then(response => response.json())
      .then(function(result) { 
  
          var translatedText = result.flavor_text_entries[0].flavor_text;
          result.flavor_text_entries.forEach(r => {
              if (r.language.name == language)
              {
                  translatedText = r.flavor_text;
                  return;
              }
          });
  
          return translatedText;
      });
  }