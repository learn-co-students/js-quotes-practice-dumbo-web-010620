// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 



//DOM selectors
const url = "http://localhost:3000/quotes?_embed=likes"
let wholeArray;
let $ = (x) => document.getElementById(x)
const quoteListUl = $("quote-list")
let newQuoteForm = $("new-quote-form")

//fetch st00f. 
const getFetch = () => fetch(url).then(r => r.json());

getFetch().then(quoteArr => {
    wholeArray = quoteArr
    renderQuoteList(wholeArray)
})

const renderQuoteList = (array) => array.forEach(quoteObject => renderQuote(quoteObject))

const renderQuote = (obj) => {
    // create Elements
    const quoteLi = document.createElement("li")
    const theBlockQuote = document.createElement("blockquote")
    const theP = document.createElement("p")
    const theFooter = document.createElement("footer")
    const br = document.createElement("br")
    const likeButton = document.createElement("button")
    const deleteButton = document.createElement("button")
    // set stuff.
    quoteLi.className = "quote-card",
    theBlockQuote.className = "blockquote"
    theP.className = "mb-0"
    theP.textContent = obj.quote
    theFooter.className = "blockquote-footer"
    theFooter.textContent = obj.author
    likeButton.className = "btn-success"
    likeButton.innerHTML = `Likes: <span>${obj.likes.length}</span>`
    deleteButton.className = "btn-danger"
    deleteButton.textContent = "Delete"
    // append time
    theBlockQuote.append(theP, theFooter, likeButton, deleteButton)
    quoteLi.appendChild(theBlockQuote)
    quoteListUl.appendChild(quoteLi)
}


//Event Handler
const handleSubmit = (e) => {
    e.preventDefault()
    let newQuote = $("new-quote").value
    let newAuthor = $("author").value

    let newObject = {
        quote: newQuote,
        author: newAuthor
    }

    
    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        body: JSON.stringify(newObject)
    })
    .then(r => r.json())
    .then(newQuoteObj => {
        newQuoteObj.likes = []
        wholeArray.push(newQuoteObj)
        renderQuote(newQuoteObj)
    })
}
//Event listeners
newQuoteForm.addEventListener("submit", handleSubmit)
