// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { 
  getFirestore, collection, getDocs, query, where, limit, startAfter
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js'

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

// ... [resto del código de inicialización]

let lastVisible = null; // Variable para almacenar el último documento recuperado
let isEndOfCollection = false; // Bandera para indicar el final de la colección

var firebaseQueryTableClub = (queryData) => {
  
  return new Promise(function (resolve, reject) {
    // Si ya hemos alcanzado el final de la colección, evita realizar más consultas
    if (isEndOfCollection) {
      console.log("No more documents to fetch. End of collection reached.");
      resolve({ documents: [], endOfCollection: true });
      return;
    }

    let q;
    if (lastVisible) {
      q = query(
        collection(db, 'clubsData'),
        startAfter(lastVisible),
        limit(20)
      );
    } else {
      q = query(
        collection(db, 'clubsData'),
        limit(20)
      );
    }

    getDocs(q).then((querySnapshot) => {

      let arrayToResolve = [];
      
      if (querySnapshot.docs.length > 0) {
        lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        querySnapshot.forEach((doc) => {
          arrayToResolve.push(doc.data());
        });
      } else {
        // Marca que se ha llegado al final de la colección
        isEndOfCollection = true;
        console.log("No more documents to fetch. End of collection reached.");
      }
      resolve({ documents: arrayToResolve, endOfCollection: isEndOfCollection });
    }).catch((error) => {
      console.log('kpasa')
      reject(error);
    });
  });
}

export { firebaseQueryTableClub };
