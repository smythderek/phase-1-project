document.addEventListener('DOMContentLoaded', () => {})

// Functionality for Search For A Disney Character interactions
// 1) User types a name in the input field then hits "Find character"
//      - Event listener for submit
//      - But make it a click event, not submit, since it's not a form submission we need to store (we're not updating Disney's API)
//      - OR...do we need to store the results, so the page persists upon each visit?

const searchedTerm = document.getElementById("search-field").value;

document.getElementById("search-submit").addEventListener('click', e => {
    fetch('https://api.disneyapi.dev/character?pageSize=7450')
        // The /character endpoint defaults to providing one page of 50 results, so I'm using a pageSize that fits all 7,438 characters
    .then(res => res.json())
    .then(allCharacters => allCharacters.data.forEach(character => console.log(character.name)))
})
// This test is running successfully, but I need to figure out how to use filter 
// And where to use it -- is it in the callback above, or in a separate function below?

function renderCharacterMatches(array) {
    // const matchesArray = array.filter(character => character.name === "Alladin")
    // console.log(matchesArray)
    const namesArray = array.forEach(character => character.name);
    console.log(namesArray)

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