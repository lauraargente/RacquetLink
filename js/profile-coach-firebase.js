  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  import { getFirestore, collection, addDoc, getDocs, getDoc, where, query, limit, doc, deleteDoc} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js'

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



  var firebaseFetchUserDataById = (Id) => {
      return new Promise(function (resolve, reject) {
        let outputData = {}

        const q = query(
          collection(db, 'coachesData'),
          where('coachId', '==', Id),
          limit(1)
        )
    
        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            resolve(doc.data())
          })
        })
      })

      
    }
    // Making fuction global
    export { firebaseFetchUserDataById }