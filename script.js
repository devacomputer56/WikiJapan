document.addEventListener('DOMContentLoaded', () => {
    const dictionary = {
        "apple": "A round fruit with firm, white flesh and a green or red skin.",
        "book": "A set of written, printed, or blank sheets bound together between a front and back cover.",
        "computer": "An electronic device for storing and processing data, typically in binary form, according to instructions given to it in a variable program.",
        "javascript": "A programming language commonly used to create interactive effects within web browsers.",
        "html": "HyperText Markup Language, a standardized system for tagging text files to achieve font, color, graphic, and hyperlink effects on World Wide Web pages.",
        "css": "Cascading Style Sheets, a style sheet language used for describing the presentation of a document written in a markup language like HTML."
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

        if (dictionary.hasOwnProperty(searchTerm)) {
            const p = document.createElement('p');
            p.textContent = dictionary[searchTerm];
            resultsArea.appendChild(p);
        } else {
            const p = document.createElement('p');
            p.textContent = "Word not found.";
            resultsArea.appendChild(p);
        }
    }

    searchButton.addEventListener('click', searchWord);

    // Optional: Allow search on pressing Enter key in the input field
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchWord();
        }
    });
});
