document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsArea = document.getElementById('resultsArea');

    let activeDictionary = null;
    let activeLanguageName = '';
    let languageManifest = [];

    function updateResultsArea(message, isHTML = false) {
        resultsArea.innerHTML = '';
        const p = document.createElement('p');
        if (isHTML) {
            p.innerHTML = message;
        } else {
            p.textContent = message;
        }
        resultsArea.appendChild(p);
    }

    async function fetchLanguagesManifest() {
        try {
            const response = await fetch('languages.json');
            if (!response.ok) {
                throw new Error(`HTTP error fetching manifest! status: ${response.status}`);
            }
            languageManifest = await response.json();
        } catch (error) {
            console.error("Could not fetch languages manifest:", error);
            updateResultsArea("Error: Could not load language information. Search disabled.");
            throw error;
        }
    }

    async function loadDictionary(languageEntry) {
        try {
            const response = await fetch(languageEntry.file);
            if (!response.ok) {
                throw new Error(`HTTP error fetching dictionary! status: ${response.status} for ${languageEntry.file}`);
            }
            activeDictionary = await response.json();
            activeLanguageName = languageEntry.name;
            console.log(`Successfully loaded ${activeLanguageName} dictionary from ${languageEntry.file}`);
        } catch (error) {
            console.error(`Could not load ${languageEntry.name} dictionary from ${languageEntry.file}:`, error);
            activeDictionary = null;
            updateResultsArea(`Error: Could not load dictionary for ${languageEntry.name}. Search may be impaired.`);
            throw error;
        }
    }

    function determineBestLanguageMatch(preferredLangs, availableLangs) {
        if (!availableLangs || availableLangs.length === 0) {
            return null;
        }
        for (const prefLang of preferredLangs) {
            const exactMatch = availableLangs.find(avlLang => avlLang.code.toLowerCase() === prefLang.toLowerCase());
            if (exactMatch) {
                console.log(`Exact match found: ${prefLang}`);
                return exactMatch;
            }
        }
        for (const prefLang of preferredLangs) {
            const langPart = prefLang.split('-')[0].toLowerCase();
            const partialMatch = availableLangs.find(avlLang => avlLang.code.split('-')[0].toLowerCase() === langPart);
            if (partialMatch) {
                console.log(`Partial match found: ${prefLang} -> ${partialMatch.code}`);
                return partialMatch;
            }
        }
        const primaryLang = availableLangs.find(avlLang => avlLang.isPrimary === true);
        if (primaryLang) {
            console.log(`Using primary language: ${primaryLang.code}`);
            return primaryLang;
        }
        console.log(`Using first available language: ${availableLangs[0].code}`);
        return availableLangs[0];
    }

    async function initializeApp() {
        updateResultsArea("Initializing...");
        searchButton.disabled = true;
        try {
            await fetchLanguagesManifest();
            if (languageManifest.length === 0) {
                updateResultsArea("No languages defined in manifest. Search disabled.");
                return;
            }
            const userPreferredLangs = navigator.languages || [navigator.language || 'en-US'];
            console.log("User preferred languages:", userPreferredLangs);
            const bestMatch = determineBestLanguageMatch(userPreferredLangs, languageManifest);
            if (!bestMatch) {
                updateResultsArea("Error: Could not determine a language to load. Search disabled.");
                return;
            }
            updateResultsArea(`Loading ${bestMatch.name} dictionary...`);
            await loadDictionary(bestMatch);
            updateResultsArea(`Loaded: ${activeLanguageName}. Ready to search.`);
            searchButton.disabled = false;
        } catch (error) {
            if (!activeDictionary) {
                searchButton.disabled = true;
                 updateResultsArea("Dictionary initialization failed. Search is disabled. Check console for errors.");
            }
        }
    }

    // Updated searchWord function
    function searchWord() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        // resultsArea.innerHTML = ''; // updateResultsArea handles this

        if (searchTerm === "") {
            updateResultsArea("Please enter a word to search.");
            return;
        }

        if (!activeDictionary) {
            updateResultsArea("Dictionary not loaded or failed to load. Cannot perform search.");
            return;
        }

        if (activeDictionary.hasOwnProperty(searchTerm)) {
            const definition = activeDictionary[searchTerm];
            // Added .replace to handle potential newlines in definitions and isHTML = true
            updateResultsArea(`<strong>${activeLanguageName}</strong>: ${definition.replace(/\n/g, '<br>')}`, true);
        } else {
            updateResultsArea(`"${searchTerm}" not found in the ${activeLanguageName} dictionary.`);
        }
    }

    searchButton.addEventListener('click', searchWord);
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchWord();
        }
    });

    initializeApp();
});
