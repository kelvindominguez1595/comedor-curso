import firebase from 'firebase/app';

const firebaseConfig = {
        apiKey: "AIzaSyAjViK5-10Oj51BhSQCOATb1OaolcJAemM",
        authDomain: "cursoproyecto-c5c96.firebaseapp.com",
        databaseURL: "https://cursoproyecto-c5c96.firebaseio.com",
        projectId: "cursoproyecto-c5c96",
        storageBucket: "cursoproyecto-c5c96.appspot.com",
        messagingSenderId: "93629398846",
        appId: "1:93629398846:web:4f25c87e9d0f5e8ed8766f"
}

export const firebaseApp = firebase.initializeApp(firebaseConfig);