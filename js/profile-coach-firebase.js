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

  var firebaseUpdateUserData = (Id, newEditedData) => {
    return new Promise(function (resolve, reject) {
      let outputData = {}

      const q = query(
        collection(db, 'coachesData'),
        where('coachId', '==', Id),
        limit(1)
      )
  
      getDocs(q).then((querySnapshot) => {
      
        querySnapshot.docs.length === 0 ? reject('Ha ocurrido un error, recarga la página') : ''

        querySnapshot.forEach((doc) => {

          const docRef = doc.ref;

          console.log(newEditedData)

          updateDoc(docRef, {
            userName: newEditedData.userName,
            userSurname: newEditedData.userSurname,
            userRecommendation: newEditedData.userRecommendation,
            userBirthday: newEditedData.userBirthday,
            userGender: newEditedData.userGender,
            userNationality: newEditedData.userNationality,
            userOtherNationality: newEditedData.userOtherNationality,
            userResidence: newEditedData.userResidence,
            userLanguages: newEditedData.userLanguages,
            userSports: newEditedData.userSports,
            userAdditionalSport: newEditedData.userAdditionalSport,
            userExperience: newEditedData.userExperience,
            userAdditionalExperience: newEditedData.userAdditionalExperience,
            userClubExp: newEditedData.userClubExp,
            userOtherCoachExp: newEditedData.userOtherCoachExp,
            userTitles: newEditedData.userTitles,
            userToursJuzge: newEditedData.userToursJuzge,
            userToursOrganized: newEditedData.userToursOrganized,
            userProfessionalExp: newEditedData.userProfessionalExp,
            userCompetingNow: newEditedData.userCompetingNow,
            userInternationalExp: newEditedData.userInternationalExp,
            userWeeklyHours: newEditedData.userWeeklyHours,
            userPreferredLevel: newEditedData.userPreferredLevel,
            userStudentsAge: newEditedData.userStudentsAge,
            userAvailability: newEditedData.userAvailability,
            userMobilityContinents: newEditedData.userMobilityContinents,
            userOportunityType: newEditedData.userOportunityType,
            userExpectedSalary: newEditedData.userExpectedSalary,
            userPhoneNumber: newEditedData.userPhoneNumber,
            userLinkedin: newEditedData.userLinkedin,
            userInsta: newEditedData.userInsta,
            coachId: newEditedData.coachId,
            registerDate: newEditedData.registerDate,
            userEmail: newEditedData.userEmail,
            userAdditionalInfo: newEditedData.userAdditionalInfo,
            userAdminNote: newEditedData.userAdminNote,
            userAdminType: newEditedData.userAdminType,
            userAdminState: newEditedData.userAdminState,
          })

          resolve(console.log('actualizado correctamente'))
        })
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

  var firebaseGetProfilePicture = (userId) => {
    return new Promise(function (resolve, reject) {
      getDownloadURL(ref(storage, `profilePicUserId=${userId}`))
        .then((url) => {
          console.log('aquí')
          resolve(url);
        })
        .catch((error) => {
          console.log('aquiiií')
          console.log("Image reference not found, not a critical error");
        });
      // getDownloadURL(ref(storage, `id=${imageId}img=${index}.png;`))
      // .then((url) => {
      //     console.log(url)
      //   resolve(url);
      // })
      // .catch((error) => {
      //     console.log("Image reference not found, not a critical error")
      // })
    });
  };

  // Making fuction global
  export { firebaseGetProfilePicture }

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
  export { firebaseGetJobOffer };


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


  var firebaseGetVideo = (userId) => {
    return new Promise(function (resolve, reject) {
      getDownloadURL(ref(storage, `profileDocument=${userId}.mp4`))
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
  export { firebaseGetVideo };


  var firebaseRemoveVideo = (userId) => {
    return new Promise(function (resolve, reject) {
      deleteObject(ref(storage, `profileDocument=${userId}.mp4`))
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
  export { firebaseRemoveVideo }