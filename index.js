document.addEventListener('DOMContentLoaded', () => {})
// QUESTION: do I need this, since it's not doing anything? Use "defer" in the HTML instead?

// QUESTION: do I need to store the results, so the page persists upon each visit?

let teamIds = [];
let teamCount = 0; // Could I make this teamIds.length? Tried that but the 5 max wasn't being enforced
let showCount = 0;
let searchCount = 0;
const searchedTerm = document.getElementById("search-field").value;

document.getElementById("search-field").addEventListener('keypress', e => {
    if (e.key === "Enter") getCharacterMatches();
});

document.getElementById("search-submit").addEventListener('click', e => {
    getCharacterMatches();
    console.log(searchCount);
});

function getCharacterMatches() {
    document.getElementById("search-results").innerHTML = '';
    fetch('https://api.disneyapi.dev/character?pageSize=7450')
        // The /character endpoint defaults to providing one page of 50 results, so I'm using a pageSize that fits all 7,438 characters, in order to access all results
        // BUT...it seems like this is causing some latency on the page
    .then(res => res.json())
    .then(allCharacters => allCharacters.data.forEach(character => { // QUESTION: could I use .filter() here?
        if (character.name.toLowerCase() === document.getElementById("search-field").value.toLowerCase()) {
            renderMatchedCharacters(character);
            searchCount++;
            console.log(searchCount);
        };
    }));
    
};

// ISSUE:
    // Add a message if there are no matching results? Tried this code, but not sure where to place it
        // if (searchCount === 0) {
        //     const emptySearch = document.createElement("p");
        //     emptySearch.textContent = "No matches for that name. Please try again."
        //     document.getElementById("search-results").appendChild(emptySearch);
        //     console.log("Empty search");
        // };

function renderMatchedCharacters(obj) {
    const charSearchCard = document.createElement("div");
    charSearchCard.className = "char-search-card"
    charSearchCard.id = `searchCard-${obj.name}-${obj._id}`
    
    const charName = document.createElement("h3");
    charName.textContent = obj.name
    charSearchCard.appendChild(charName)

    const charImage = document.createElement("img");
    charImage.setAttribute('src', obj.imageUrl);
    charImage.className = "char-search-image";
    charSearchCard.appendChild(charImage)

    const addBtn = document.createElement("button");
    addBtn.id = `add-button-${obj.name}-${obj._id}`;
    charSearchCard.appendChild(addBtn);
    if (!teamIds.includes(obj._id)) {
        console.log("Not in the team");
        addBtn.textContent = "Add";
    }; 
    
    document.getElementById("search-results").appendChild(charSearchCard);

    addBtn.addEventListener('click', () => {
        if (teamCount < 5) {
            addToTeam(obj);
            addBtn.textContent = "Added";
            addBtn.disabled = true;
        }
        else alert("Your team is full!");  // can we handle this more elegantly? disable all addBtn?
    })

    // If the search result is already on the team, prevent adding them to the team again
    if (teamIds.includes(obj._id)) {
        addBtn.textContent = "Added";
        addBtn.disabled = true;
    }
}

function addToTeam(charObj) {
    teamCount++;
    teamIds.push(charObj._id);
    console.log(teamIds);

    const teamCards = document.getElementById("team-cards");

    const charCard = document.createElement("div");
    charCard.id = `teamCard-${charObj.name}-${charObj._id}`;
    charCard.className = "char-team-card";
    teamCards.appendChild(charCard); 

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";
    charCard.appendChild(imageContainer);

    const charImage = document.createElement("img");
    charImage.setAttribute('src', charObj.imageUrl);
    charImage.className = "char-team-image-base";
    imageContainer.appendChild(charImage);

    const charName = document.createElement("h3");
    charName.className = "char-name";
    charName.textContent = charObj.name;
    charName.hidden = true;
    imageContainer.appendChild(charName);

    const detailsButton = document.createElement("button");
    detailsButton.id = `details-button`;
    detailsButton.className = "button";
    detailsButton.textContent = "Show details";
    charCard.appendChild(detailsButton);

    const removeBtn = document.createElement("button");
    removeBtn.id = `remove-button-${charObj.name}-${charObj._id}`;
    removeBtn.className = "button";
    removeBtn.textContent = "Remove";
    charCard.appendChild(removeBtn);    

    removeBtn.addEventListener('click', (e) => {
        teamCount--;

        charCard.remove();

        // Remove the ID from teamIds array so the character can be re-added in subsequent searches
        const idIndex = teamIds.indexOf(charObj._id);
        const removedID = teamIds.splice(idIndex, 1); // This works, but is this good syntax?
        
        document.getElementById(`add-button-${charObj.name}-${charObj._id}`).textContent = 'Add';
        // ISSUE: This is throwing an error but the UX is working
        document.getElementById(`add-button-${charObj.name}-${charObj._id}`).disabled = false;
    })

    const charDetails = document.createElement("div");
    charDetails.id = `details-${charObj.name}-${charObj._id}`;
    document.getElementById("more-details").appendChild(charDetails);
    charDetails.hidden = true;

    const charMovies = document.createElement("p");
    renderCharDetails(charObj.films, charMovies, "Movies");
    charDetails.appendChild(charMovies);

    const charShortFilms = document.createElement("p");
    renderCharDetails(charObj.shortFilms, charShortFilms, "Short Films");
    charDetails.appendChild(charShortFilms);

    const charTvShows = document.createElement("p");
    renderCharDetails(charObj.tvShows, charTvShows, "TV Shows");
    charDetails.appendChild(charTvShows);

    const charVideoGames = document.createElement("p");
    renderCharDetails(charObj.tvShows, charVideoGames, "Video Games");
    charDetails.appendChild(charVideoGames);

    const charParkAttractions = document.createElement("p")
    renderCharDetails(charObj.parkAttractions, charParkAttractions, "Park Attractions")
    charDetails.appendChild(charParkAttractions);

    imageContainer.addEventListener("mouseover", () => {
        charImage.className = "char-team-image-hover";
        charName.hidden = false;
    })

    imageContainer.addEventListener("mouseout", () => {
        charImage.className = "char-team-image-base";
        charName.hidden = true;
    })

    detailsButton.addEventListener("click", () => {
        if (detailsButton.textContent === "Show details") {
            charDetails.hidden = false;
            detailsButton.textContent = "Hide details";
            charCard.className = "char-container-with-details";
            showCount = 1;
            console.log(showCount);
        }
        else {
            charDetails.hidden = true;
            detailsButton.textContent = "Show details";
            charCard.className = "char-team-card";
            showCount = 0;
            console.log(showCount);
        }
    });

// ISSUE:
    // When a character's details are shown, need to disable all other "show details" buttons
}

function renderCharDetails(array, element, title) {
    if (array.length === 0) {
        element.innerHTML = `<b>${title}: </b> None`;
    }
    else element.innerHTML = `<b>${title}: </b>` + `${array.join(', ')}`;
}