// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

// step 2a establish a variable for the html section of list of quotes
const quoteList = document.getElementById("quote-list")
// step 5a establish a variable for quote form
const newQuoteForm = document.getElementById("new-quote-form")

//step 5b create event listener for submitting and updating a quote to the bakcend
newQuoteForm.addEventListener("submit", event => {
    event.preventDefault()

    const newQuote = document.getElementById("new-quote").value
    const newAuthor = document.getElementById("author").value

    fetch('http://localhost:3000/quotes', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor
        })
    })
    .then(r => r.json())
    .then(newQuoteObj => renderSingleQuote(newQuoteObj))
    
}) 

// step 1 - fetch using url to get JSON data
fetch('http://localhost:3000/quotes?_embed=likes')
    .then(r => r.json())
    // step 4 - insert render all quote function here
    .then(data => renderAllQuotes(data))

// step 2b - render single quotes and then append it to the list
function renderSingleQuote(quote) {
    const newLi = document.createElement("Li")
    newLi.className = "quote-card"
    // includes likes for every quote so that it doesnt error out
    let likesCount;
    if (quote.likes) {
        likesCount = quote.likes.length
    } else {
        likesCount = 0
    }
    // step 2c - the newLi form
    newLi.innerHTML = `
        <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${likesCount}</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
        `

    // step 6a - create a delete button variable
    const deleteBtn = newLi.querySelector(".btn-danger")
    // step 6b - create event listener for delete button with delete request
    deleteBtn.addEventListener("click", event => {
        newLi.remove()
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: "DELETE"
        })
    })
    
    // step 7 - create a like button variable
    const likeBtn = newLi.querySelector(".btn-success")
    // step 7 - create event listener for like button to increase with fetch request
    likeBtn.addEventListener("click", event => {
        fetch(`http://localhost:3000/likes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quoteId: quote.id
            })
        })
        .then(r => r.json())
        .then(() => {
        const likesSpan = newLi.querySelector("span")
        let currentLikes = parseInt(likesSpan.textContent)
        currentLikes++
        likesSpan.textContent = currentLikes
    })
    })
    
    quoteList.append(newLi)
}

// step 3 - render all quote function
function renderAllQuotes(quoteArray) {
    quoteArray.forEach(quote => {
        renderSingleQuote(quote)
    })
}