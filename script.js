// script.js
document.addEventListener('DOMContentLoaded', () => {
    const dictionary = {
        "en": {
            "apple": "A round fruit with firm, white flesh and a green or red skin.",
            "book": "A set of written, printed, or blank sheets bound together between a front and back cover.",
            "computer": "An electronic device for storing and processing data, typically in binary form, according to instructions given to it in a variable program.",
            "javascript": "A programming language commonly used to create interactive effects within web browsers.",
            "html": "HyperText Markup Language, a standardized system for tagging text files to achieve font, color, graphic, and hyperlink effects on World Wide Web pages.",
            "css": "Cascading Style Sheets, a style sheet language used for describing the presentation of a document written in a markup language like HTML.",
            "mountain": "A large natural elevation of the earth's surface rising abruptly from the surrounding level; a large steep hill.",
            "ocean": "A very large expanse of sea, in particular, each of the main areas into which the sea is divided geographically.",
            "galaxy": "A system of millions or billions of stars, together with gas and dust, held together by gravitational attraction.",
            "philosophy": "The study of the fundamental nature of knowledge, reality, and existence, especially when considered as an academic discipline."
        },
        "es": {
            "manzana": "Fruta redonda con pulpa blanca y firme y piel verde o roja.",
            "libro": "Conjunto de hojas escritas, impresas o en blanco encuadernadas entre una portada y una contraportada.",
            "ordenador": "Dispositivo electrónico para almacenar y procesar datos, típicamente en forma binaria, de acuerdo con las instrucciones que se le dan en un programa variable. (Note: 'computadora' is also common in Latin America)",
            "montaña": "Gran elevación natural de la superficie terrestre que se eleva abruptamente desde el nivel circundante; una colina grande y empinada.",
            "océano": "Una extensión muy grande de mar, en particular, cada una de las áreas principales en las que se divide geográficamente el mar.",
            "galaxia": "Sistema de millones o miles de millones de estrellas, junto con gas y polvo, unidos por atracción gravitacional.",
            "filosofía": "Estudio de la naturaleza fundamental del conocimiento, la realidad y la existencia, especialmente cuando se considera como una disciplina académica.",
            "agua": "Sustancia líquida transparente, inodora, incolora e insípida, esencial para todos los seres vivos.",
            "sol": "La estrella alrededor de la cual orbita la Tierra y otros planetas del sistema solar, que proporciona luz y calor."
        },
        "fr": {
            "pomme": "Fruit rond à chair blanche et ferme et à peau verte ou rouge.",
            "livre": "Ensemble de feuilles écrites, imprimées ou vierges reliées ensemble entre une couverture et une quatrième de couverture.",
            "ordinateur": "Appareil électronique de stockage et de traitement de données, typiquement sous forme binaire, selon les instructions qui lui sont données dans un programme variable.",
            "montagne": "Grande élévation naturelle de la surface de la terre s'élevant brusquement du niveau environnant ; une grande colline escarpée.",
            "océan": "Très grande étendue de mer, en particulier chacune des principales zones dans lesquelles la mer est divisée géographiquement.",
            "galaxie": "Système de millions ou de milliards d'étoiles, ainsi que de gaz et de poussière, maintenus ensemble par l'attraction gravitationnelle.",
            "philosophie": "Étude de la nature fondamentale de la connaissance, de la réalité et de l'existence, en particulier lorsqu'elle est considérée comme une discipline universitaire.",
            "eau": "Substance liquide transparente, inodore, incolore et insipide, essentielle à tous les êtres vivants.",
            "soleil": "L'étoile autour de laquelle la Terre et les autres planètes du système solaire orbitent, qui fournit lumière et chaleur."
        }
    };

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsArea = document.getElementById('resultsArea');

    function searchWord() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        resultsArea.innerHTML = ''; // Clear previous results

        if (searchTerm === "") {
            const p = document.createElement('p');
            p.textContent = "Please enter a word to search.";
            resultsArea.appendChild(p);
            return;
        }

        let foundOverall = false;
        for (const langCode in dictionary) {
            if (dictionary.hasOwnProperty(langCode)) {
                const languageDictionary = dictionary[langCode];
                if (languageDictionary.hasOwnProperty(searchTerm)) {
                    const p = document.createElement('p');
                    // Displaying language name more formally (e.g., English, Spanish)
                    let langName = langCode; // Default to code
                    if (langCode === 'en') langName = 'English';
                    if (langCode === 'es') langName = 'Spanish';
                    if (langCode === 'fr') langName = 'French';

                    p.textContent = `${langName}: ${languageDictionary[searchTerm]}`;
                    resultsArea.appendChild(p);
                    foundOverall = true;
                }
            }
        }

        if (!foundOverall) {
            const p = document.createElement('p');
            p.textContent = "Word not found in any supported language.";
            resultsArea.appendChild(p);
        }
    }

    searchButton.addEventListener('click', searchWord);
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchWord();
        }
    });
});
