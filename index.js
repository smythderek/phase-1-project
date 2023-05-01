let teamIds = [];
let teamCount = 0;
let searchCount = 0;

document.getElementById("search-field").addEventListener('keypress', e => {
    if (e.key === "Enter") {
        searchCount = 0;
        getCharacterMatches();
    }
});

document.getElementById("search-submit").addEventListener('click', e => {
    searchCount = 0;
    getCharacterMatches();
});

function getCharacterMatches() {
    document.getElementById("search-results").innerHTML = '';
    fetch('https://api.disneyapi.dev/character?pageSize=7450')
    .then(res => res.json())
    .then(allCharacters => allCharacters.data.forEach(character => { 
        if (character.name.toLowerCase() === document.getElementById("search-field").value.toLowerCase()) {
            renderMatchedCharacters(character);
        }
    }))
    .then(finishedSearch => {
        if (searchCount === 0) {
            const emptySearch = document.createElement("p");
            emptySearch.id = "empty-search-message";
            emptySearch.textContent = "No matches for that name. Please try again."
            document.getElementById("search-results").appendChild(emptySearch);
        };
    });
};      

function renderMatchedCharacters(obj) {
    searchCount++;

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
    addBtn.textContent = "Add";
    charSearchCard.appendChild(addBtn);
    
    document.getElementById("search-results").appendChild(charSearchCard);

    addBtn.addEventListener('click', () => {
        if (teamCount < 5) {
            addToTeam(obj);
            addBtn.textContent = "Added";
            addBtn.disabled = true;
        }
        else alert("Your team is full!");
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

    const removeBtn = document.createElement("button");
    removeBtn.id = `remove-button-${charObj.name}-${charObj._id}`;
    removeBtn.className = "button";
    removeBtn.textContent = "Remove";
    charCard.appendChild(removeBtn); 
    
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
    renderCharDetails(charObj.videoGames, charVideoGames, "Video Games");
    charDetails.appendChild(charVideoGames);

    const charParkAttractions = document.createElement("p")
    renderCharDetails(charObj.parkAttractions, charParkAttractions, "Park Attractions")
    charDetails.appendChild(charParkAttractions);

    removeBtn.addEventListener('click', (e) => {
        teamCount--;

        charCard.remove();
        document.getElementById(`details-${charObj.name}-${charObj._id}`).remove();

        // Remove the ID from teamIds array so the character can be re-added in subsequent searches
        const idIndex = teamIds.indexOf(charObj._id);
        const removedID = teamIds.splice(idIndex, 1);
        
        // If the team member is still showing as a search result, re-enable the "Add" button
        if (document.getElementById(`add-button-${charObj.name}-${charObj._id}`)) {
            document.getElementById(`add-button-${charObj.name}-${charObj._id}`).textContent = 'Add';
            document.getElementById(`add-button-${charObj.name}-${charObj._id}`).disabled = false;
        }
    })

    imageContainer.addEventListener("mouseover", () => {
        charImage.className = "char-team-image-hover";
        charName.hidden = false;
        charDetails.hidden = false;
        charCard.className = "char-container-with-details";
    });

    imageContainer.addEventListener("mouseout", () => {
        charImage.className = "char-team-image-base";
        charName.hidden = true;
        charDetails.hidden = true;
        charCard.className = "char-team-card";
    });
}

function renderCharDetails(array, element, title) {
    if (array.length === 0) {
        element.innerHTML = `<b>${title}: </b> None`;
    }
    else element.innerHTML = `<b>${title}: </b>` + `${array.join(', ')}`;
}