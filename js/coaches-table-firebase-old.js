// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { 
  getFirestore, collection, getDocs, query, where, limit, Timestamp
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

var lastDateMagnitude

function calculateAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function createQueryWithConditions(db, collectionName, conditions, ageRange) {
  const collectionRef = collection(db, collectionName);
  let queryConditions = [];

  for (const condition of conditions) {
    const filteredValues = condition.values.filter(value => value !== 'all');
    if (filteredValues.length === 0) {
      continue;
    }

    // Utiliza 'in' en lugar de 'array-contains-any'
    if (filteredValues.length <= 10) {
      queryConditions.push(where(condition.field, 'in', filteredValues));
    } else {
      console.error("Firestore no soporta 'in' con más de 10 elementos");
    }
  }

  // Lógica para el rango de edad
  if (ageRange && ageRange.length === 2) {
    const [minAge, maxAge] = ageRange;
    queryConditions.push(where('userBirthdayAsValue', '<=', calculateBirthDateTimestampFromAge(minAge)));
    queryConditions.push(where('userBirthdayAsValue', '>=', calculateBirthDateTimestampFromAge(maxAge)));
  }

  return query(collectionRef, ...queryConditions, limit(10));
}

function calculateBirthDateTimestampFromAge(age) {
  const today = new Date();
  const birthDate = new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
  return birthDate.getTime();  // Devuelve el valor numérico en milisegundos
}


var firebaseQueryTableCoach = (queryData) => {
  
//   var queryData = {
//     dataLanguages: ['all'],
//     dataSports: ['all'],
//     dataAvailability: ['all'],
//     dataExperience: ['all'],
//     dataNationality: [],
//     dataAge: []
// }

queryData.dataNationality[0] === 'un' ? queryData.dataNationality[0] = 'all' : ''

console.log(queryData)
// console.log(queryData.dataNationality)




  return new Promise(function (resolve, reject) {

    let conditions = [
      // { field: 'userLanguages', values: queryData.dataLanguages },
      { field: 'userLanguages', values: queryData.dataLanguages },
      { field: 'userSports', values: queryData.dataSports },
      { field: 'userAvailability', values: queryData.dataAvailability },
      { field: 'userExperience', values: queryData.dataExperience },
      { field: 'userNationality', values: queryData.dataNationality },
    ];

    let q = createQueryWithConditions(db, 'coachesData', conditions, queryData.dataAge);

    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((docSnapshot) => {
        console.log(docSnapshot.data());
        console.log(docSnapshot.data().userBirthdayAsValue);

        // Otras operaciones con los datos
      });
      console.log('okey')
      // resolve([outputData, newReferenceArticle])
    });
  });
}

export { firebaseQueryTableCoach };