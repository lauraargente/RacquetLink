import { firebaseFetchArticle } from "./news-showpost-firebase.js"

var id = 'GulRQCjqBCuPFXfo2riU'




// console.log(firebaseFetchArticle(id))

var showTitle = document.querySelector('#article-title')
var showContent = document.querySelector('#article-content')
var showDateAndAuthor= document.querySelector('#article-dateandauthor')
// var showAuthor = document.querySelector('#article-author')
// var showTags = document.querySelector('#article-tags')
var showTags = document.querySelectorAll('.article-tag')


firebaseFetchArticle(id)
  .then( (result) => {
    console.log(result.author);
    showTitle.innerHTML = result.title;
    showContent.innerHTML = result.content;

    // Show reduced date
    var fullDate = result.date;
    var regex = /([A-Za-z]{3} \d{1,2})/;
    var match = fullDate.match(regex);
    showDateAndAuthor.innerHTML = `${match[0]} | ${result.author}`;

    // showAuthor.innerHTML = result.author;

    // console.log(result.tags)
    (result.tags).forEach((element,id) => {
      showTags[id].innerHTML = element
      showTags[id].style.display = 'flex'
    });
    showTags.innerHTML = result.tags

    const element = document.querySelector("#article-content > div.ql-editor");
    element.setAttribute("contenteditable", "false");

    // result.Title =
  })
