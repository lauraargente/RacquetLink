  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  import { getFirestore, collection, addDoc, getDoc, getDocs, where, orderBy, query, limit, doc, deleteDoc} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js'

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAqel3JAhMxL5l426roQxk-qayASU6uYbY",
    authDomain: "racquetlink.firebaseapp.com",
    projectId: "racquetlink",
    storageBucket: "racquetlink.appspot.com",
    messagingSenderId: "122086812417",
    appId: "1:122086812417:web:7f5d796fa3bef8df35c900",
    measurementId: "G-RXX34BJDJ5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const analytics = getAnalytics(app);
  

  // uploadArticle toma un array de artículo y lo publica en firebase
  var uploadArticle = (articleToUploadArray) => {
    console.log(articleToUploadArray.articleLanguage)
    console.log('asdassdas')
    console.log('asdassdas')
    console.log('asdassdas')
    console.log('asdassdas')

    return new Promise(function (resolve, reject) {

      try {
        firebaseGetArticleNumber().then( articleNumber => {
          const docRef = addDoc(collection(db, 'articles'), {
            Title: articleToUploadArray.articleTitle,
            Author: articleToUploadArray.articleAuthor,
            Content: articleToUploadArray.articleContent,
            Tags: articleToUploadArray.articleTags,
            Date: articleToUploadArray.articleDate,
            articleLanguage: articleToUploadArray.articleLanguage,
            articleNumber: (articleNumber+1),
            DateMagnitude: (new Date).getTime(),
        })
        // Aquí faltaría redirigir a la página de artículo
        resolve()
        })
      } catch (e) {
          console.error('Error adding document: ', e)
      }
  })
  }

  export { uploadArticle }

  // getLastArticleNumber obtiene el número del último artículo publicado (todos están numerados)
  var firebaseGetArticleNumber = () => {
    return new Promise(function (resolve, reject) {
  
      const q = query(
        collection(db, 'articles'),
        orderBy("articleNumber", "desc"),
        limit(1)
      )
      var outputData

      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((querySnapshot) => {
          outputData = querySnapshot.data().articleNumber
        })
        resolve(outputData)
      })

      })
    
  }
  // Making fuction global
  export { firebaseGetArticleNumber }

