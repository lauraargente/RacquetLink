  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
  import { getStorage, ref, uploadString, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
  import { getFirestore, collection, addDoc, getDocs, getDoc, where, query, limit, doc, updateDoc} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js'

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
  const storage = getStorage(app);



  var firebaseFetchUserDataById = (Id) => {
      return new Promise(function (resolve, reject) {
        let outputData = {}

        console.log(Id)
        const q = query(
          collection(db, 'clubsData'),
          where('clubId', '==', Id),
          limit(1)
        )
    
        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.data())
            resolve(doc.data())
          })
        }).catch( error => {
          console.log('somethinggggggggg' + error)
        })
      })

      
    }
    // Making fuction global
    export { firebaseFetchUserDataById }

  var firebaseUpdateUserData = (Id, newEditedData) => {

    return new Promise(function (resolve, reject) {
      let outputData = {}

      const q = query(
        collection(db, 'clubsData'),
        where('clubId', '==', Id),
        limit(1)
      )
  
      getDocs(q).then((querySnapshot) => {

        querySnapshot.docs.length === 0 ? reject() : ''
        querySnapshot.forEach((doc) => {

          const docRef = doc.ref;

          updateDoc(docRef, {
            clubSports: newEditedData.clubSports,
            clubField: newEditedData.clubField,
            clubState: newEditedData.clubState,
            clubConsulting: newEditedData.clubConsulting,
            clubEmail: newEditedData.clubEmail,
            clubNumber: newEditedData.clubNumber,
            clubId: newEditedData.clubId,
            clubAdditionalInfo: newEditedData.clubAdditionalInfo,
            clubAdminNote: newEditedData.clubAdminNote,
          })

          resolve()
        })
      }).catch( (error) => {
        console.log(error)
      })

    })
  }
    
  // Making fuction global
  export { firebaseUpdateUserData }

  var firebaseUpdateProfilePicture = (file, name) => {
      return new Promise(function (resolve, reject) {
          const reference = ref(storage, name)

          uploadString(reference, file, 'base64').then((snapshot) => {
              console.log('Uploaded a blob or file!')
              resolve()
          })
          .catch( (error) => {
              reject(error)
          })
      })
  }

  // Making fuction global
  export { firebaseUpdateProfilePicture }


  var firebaseUploadDocument = (file, name) => {
    return new Promise(function (resolve, reject) {
        const reference = ref(storage, name)

        uploadBytes(reference, file).then((snapshot) => {
            console.log('Uploaded a document!')
            resolve()
        })
        .catch( (error) => {
            reject(error)
        })
    })
}

// Making fuction global
export { firebaseUploadDocument }


  var firebaseGetProfilePicture = (userId) => {
    return new Promise(function (resolve, reject) {
      getDownloadURL(ref(storage, `profilePicUserId=${userId}.png`))
        .then((url) => {
          resolve(url)
        })
        .catch((error) => {
          console.log('Image reference not found, not a critical error')
        })
    })
  }

  // Making fuction global
  export { firebaseGetProfilePicture }


  var firebaseGetJobOffer = (userId) => {
    return new Promise(function (resolve, reject) {
      getDownloadURL(ref(storage, `profileDocument=${userId}.pdf`))
        .then((url) => {
          console.log(url)
          resolve(url)
        })
        .catch((error) => {
          console.log('Document reference not found, not a critical error')
        })
    })
  }

  // Making fuction global
  export { firebaseGetJobOffer }


  var firebaseRemoveJobOffer = (userId) => {
    return new Promise(function (resolve, reject) {
      deleteObject(ref(storage, `profileDocument=${userId}.pdf`))
        .then((result) => {
          console.log(result)
          resolve(result)
        })
        .catch((error) => {
          console.log('Document reference not found, not a critical error')
        })
    })
  }

  // Making fuction global
  export { firebaseRemoveJobOffer }