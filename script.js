document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsArea = document.getElementById('resultsArea');

    let loadedDictionaries = {};
    let languageManifest = []; // To store the content of languages.json

    function updateResultsArea(message) {
        resultsArea.innerHTML = '';
        const p = document.createElement('p');
        p.textContent = message;
        resultsArea.appendChild(p);
    }

    async function fetchLanguagesManifest() {
        try {
            const response = await fetch('languages.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            languageManifest = await response.json(); // Populate languageManifest
        } catch (error) {
            console.error("Could not fetch languages manifest:", error);
            updateResultsArea("Error: Could not load language information.");
            throw error;
        }
    }

    async function loadLanguageFile(languageEntry) {
        try {
            const response = await fetch(languageEntry.file);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${languageEntry.file}`);
            }
            loadedDictionaries[languageEntry.code] = await response.json();
            console.log(`Successfully loaded ${languageEntry.name} dictionary.`);
        } catch (error) {
            console.error(`Could not load ${languageEntry.name} dictionary from ${languageEntry.file}:`, error);
        }
    }

    async function initializeApp() {
        updateResultsArea("Loading dictionaries...");
        searchButton.disabled = true;
        try {
            await fetchLanguagesManifest();

            const loadPromises = languageManifest.map(lang => loadLanguageFile(lang));
            await Promise.all(loadPromises);

            if (Object.keys(loadedDictionaries).length > 0) {
                updateResultsArea("Dictionaries loaded. Ready to search.");
                searchButton.disabled = false;
            } else {
                updateResultsArea("Error: No dictionaries could be loaded. Please check the console.");
                searchButton.disabled = true;
            }
        } catch (error) {
            if (Object.keys(loadedDictionaries).length === 0) {
                 updateResultsArea("Failed to initialize dictionaries. Please check console for errors.");
                 searchButton.disabled = true;
            }
        }
    }

    // Updated searchWord function
    function searchWord() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        resultsArea.innerHTML = ''; // Clear previous results

        if (searchTerm === "") {
            updateResultsArea("Please enter a word to search."); // Using updateResultsArea
            return;
        }

        if (Object.keys(loadedDictionaries).length === 0) {
            updateResultsArea("Dictionaries are not loaded or failed to load. Cannot perform search.");
            return;
        }

        let foundOverall = false;
        for (const langCode in loadedDictionaries) {
            if (loadedDictionaries.hasOwnProperty(langCode)) {
                const languageDictionary = loadedDictionaries[langCode];
                if (languageDictionary.hasOwnProperty(searchTerm)) {
                    const p = document.createElement('p');

                    let langName = langCode;
                    const langManifestEntry = languageManifest.find(l => l.code === langCode);
                    if (langManifestEntry) {
                        langName = langManifestEntry.name;
                    }

                    p.textContent = `${langName}: ${languageDictionary[searchTerm]}`;
                    resultsArea.appendChild(p);
                    foundOverall = true;
                }
            }
        }

        if (!foundOverall) {
            updateResultsArea(`"${searchTerm}" not found in any loaded dictionary.`);
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
