document.addEventListener('DOMContentLoaded', () => {})
// QUESTION: do I need this, since it's not doing anything? Use "defer" in the HTML instead?

// QUESTION: do I need to store the results, so the page persists upon each visit?

const searchedTerm = document.getElementById("search-field").value;
document.getElementById("hover-instructions").hidden = true;

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

function renderMatchedCharacters(obj) {
    // ISSUE: need to check if the search result is already on the team. If so, button is "added" and disabled
    
    const charSearchCard = document.createElement("div");
    charSearchCard.className = "char-search-card"
    charSearchCard.id = `searchCard-${obj.name}-${obj._id}`
    
    const charName = document.createElement("h3");
    charName.textContent = obj.name
    charSearchCard.appendChild(charName)

    const charImage = document.createElement("img");
    charImage.setAttribute('src', obj.imageUrl);
    charImage.className = "char-image";
    charSearchCard.appendChild(charImage)

    const addBtn = document.createElement("button");
    addBtn.id = `add-button-${obj.name}-${obj._id}`;
    addBtn.textContent = "Add";
    charSearchCard.appendChild(addBtn);
    
    document.getElementById("search-results").appendChild(charSearchCard);

    addBtn.addEventListener('click', () => addToTeam(obj))

    addBtn.addEventListener('click', () => {
        addBtn.textContent = "Added";
        addBtn.disabled = true;
    })
}

function addToTeam(charObj) {
    document.getElementById("hover-instructions").hidden = false;

    const charContainer = document.createElement("div");
    charContainer.id = `charContainer-${charObj.name}-${charObj._id}`;
    charContainer.className = "char-container";
    document.getElementById("team-cards").appendChild(charContainer);

    const charCard = document.createElement("div");
    charCard.id = `teamCard-${charObj.name}-${charObj._id}`;
    charCard.className = "char-team-card";
    charContainer.appendChild(charCard); 
    
    const charName = document.createElement("h3");
    charName.textContent = charObj.name;
    charCard.appendChild(charName);

    const charImage = document.createElement("img");
    charImage.setAttribute('src', charObj.imageUrl);
    charImage.className = "char-image";
    charCard.appendChild(charImage);

    const charDetails = document.createElement("div");
    charDetails.id = `details-${charObj.name}-${charObj._id}`;
    charDetails.className = "char-details";
    charCard.appendChild(charDetails);
    charDetails.hidden = true;

    const charMovies = document.createElement("p");
    addNone(charObj.films, charMovies, "Movies");
    charDetails.appendChild(charMovies);

    const charShortFilms = document.createElement("p");
    addNone(charObj.shortFilms, charShortFilms, "Short Films");
    charDetails.appendChild(charShortFilms);

    const removeBtn = document.createElement("button");
    removeBtn.id = `remove-button-${charObj.name}-${charObj._id}`;
    removeBtn.textContent = "Remove";
    charCard.appendChild(removeBtn);    

    removeBtn.addEventListener('click', (e) => {
        charCard.remove();
        // ADD CODE HERE TO HIDE THE HOVER INSTRUCTIONS IF THERE AREN'T ANY CARDS
        document.getElementById(`add-button-${charObj.name}-${charObj._id}`).disabled = false;
        document.getElementById(`add-button-${charObj.name}-${charObj._id}`).textContent = 'Add';
    })

    charImage.addEventListener("mouseover", () => charDetails.hidden = false);
    charImage.addEventListener("mouseout", () => charDetails.hidden = true);
    // QUESTION: Do I want to enable to hover-to-see-more-details for the search results too?

}

function addNone(array, element, title) {
    if (array.length === 0) {
        element.innerHTML = `<b>${title}: </b> None`;
    }
    else element.innerHTML = `<b>${title}: </b>` + `${array.join(', ')}`;
}

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