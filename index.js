document.addEventListener('DOMContentLoaded', () => {})
// QUESTION: do I need this, since it's not doing anything? Use "defer" in the HTML instead?

// QUESTION: do I need to store the results, so the page persists upon each visit?

const searchedTerm = document.getElementById("search-field").value;

document.getElementById("search-field").addEventListener('keypress', e => {
    if (e.key === "Enter") getCharacterMatches()
})

document.getElementById("search-submit").addEventListener('click', e => getCharacterMatches())

function getCharacterMatches() {
    document.getElementById("search-results").innerHTML = '';
    fetch('https://api.disneyapi.dev/character?pageSize=7450')
        // The /character endpoint defaults to providing one page of 50 results, so I'm using a pageSize that fits all 7,438 characters, in order to access all results
        // BUT...it seems like this is causing some latency on the page
    .then(res => res.json())
    .then(allCharacters => allCharacters.data.forEach(character => {
        if (character.name.toLowerCase() === document.getElementById("search-field").value.toLowerCase()) {
            renderMatchedCharacters(character)
        }
    }))
}

// ADD a message if there are no matching results?

let teamCount = 0;

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
    addBtn.textContent = "Add";
    charSearchCard.appendChild(addBtn);
    
    document.getElementById("search-results").appendChild(charSearchCard);

    addBtn.addEventListener('click', () => {
        if (teamCount < 5) {
            addToTeam(obj);
            addBtn.textContent = "Added";
            addBtn.disabled = true;
        }
        else alert("Your team is full!");  // can we handle this more elegantly? disable all addBtn?
    })
}

function addToTeam(charObj) {
    teamCount++;

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
        console.log(teamCount);
        charCard.remove();
        document.getElementById(`add-button-${charObj.name}-${charObj._id}`).disabled = false;
        document.getElementById(`add-button-${charObj.name}-${charObj._id}`).textContent = 'Add';
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
        }
        else {
            charDetails.hidden = true;
            detailsButton.textContent = "Show details";
        }
    });

// ISSUES:
    // Limit only one character's details can be shown at a time
    // 

}

function renderCharDetails(array, element, title) {
    if (array.length === 0) {
        element.innerHTML = `<b>${title}: </b> None`;
    }
    else element.innerHTML = `<b>${title}: </b>` + `${array.join(', ')}`;
}


// For team member card:
    // Set image dimensions
    // Remove name above
    // Show name on hover
        // Is that interesting enough?
        // Maybe incl the number of films and short films?
    // Click somehwere to view full details (which shows in the div below)

// 2) Submit event fetches data from Disney API -- all characters
//      - .filter() through the all-character results to only return an array of characters whose names CONTAIN the query
// 3) Render all of those matches into div cards
//      - Image, name, and "Add to team" button
//      - Once "Add to team" is clicked, disable that button and/or change it to "Already on your Dream Team!"




// Functionality for Your Dream Team interactions
// 4) Add chosen character's card to the "Your Dream Team" section
//      - Image, name
//      - Button to remove them from the team
//      - Have rank order for the chosen ones?
//      - Is there a limit of five or do we scrap that?
// 5) Upon hovering over the card of a dream team member, show an overlay with the following stats:
//      - Total number of films the character has appeared in
//      - Total number of short films the character has appeared in
//      - Total number of animated shows the character has appeared in
//      - Total number of video games the character has appeared in
//      - Total number of park attractions the character has appeared in
//      - List of allies for this character
//      - List of enemies for this character