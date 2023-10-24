import { firebaseFetchArticlesByDate } from "./news-allposts-firebase.js"
import { firebaseFetchNewArticlesByDate } from "./news-allposts-firebase.js"
import { firebaseFetchArticleById } from "./news-showpost-firebase.js"

var arrayOfArticles = []

firebaseFetchArticlesByDate()
  .then( (result) => {
    console.log(result);
    // InjectReducedArticles
    result.forEach(element => {
        firebaseFetchArticleById(element)
            .then( (result2) => {
                arrayOfArticles.push(result2)
            })
        // Aquí habría que inyectar cada artículo
    });
  })

// Aquí incluir un OnClick con la función firebaseFetchNewArticlesByDate que funcione como la de arriba pero añadiendo nuevos artículos a la carga