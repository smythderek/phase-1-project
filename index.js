document.addEventListener('DOMContentLoaded', () => {})

// Functionality for Search For A Disney Character interactions
// 1) User types a name in the input field then hits "Find character"
//      - Event listener for submit
//      - But make it a click event, not submit, since it's not a form submission we need to store (we're not updating Disney's API)
//      - OR...do we need to store the results, so the page persists upon each visit?

const searchedTerm = document.getElementById("search-field").value;

// Can I also trigger all of the below by "Enter" being pressed on the keyboard?

document.getElementById("search-field").addEventListener('keypress', e => {
    if (e.key === "Enter") {getCharacterMatches()}
})

document.getElementById("search-submit").addEventListener('click', e => getCharacterMatches())

function getCharacterMatches() {
    document.getElementById("search-results").innerHTML = '';
    fetch('https://api.disneyapi.dev/character?pageSize=7450')
        // The /character endpoint defaults to providing one page of 50 results, so I'm using a pageSize that fits all 7,438 characters
    .then(res => res.json())
    .then(allCharacters => allCharacters.data.forEach(character => {
        if (character.name.toLowerCase() === document.getElementById("search-field").value.toLowerCase()) {
            renderMatchedCharacters(character)
        }
    }))
}

function renderMatchedCharacters(obj) {
    const charCard = document.createElement("div");
    charCard.className = "char-card"
    
    const charName = document.createElement("h3");
    charName.textContent = obj.name
    charCard.appendChild(charName)

    const charImage = document.createElement("img");
    charImage.setAttribute('src', obj.imageUrl);
    charImage.className = "char-image";
    charCard.appendChild(charImage)

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add to Dream Team";
    charCard.appendChild(addBtn);
    
    // Add in a button to add them to the team
    document.getElementById("search-results").appendChild(charCard);
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