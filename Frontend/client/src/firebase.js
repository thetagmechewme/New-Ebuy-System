import firebase from 'firebase/app';
import 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDl1dTyqtpiZyUC02Lg5bYBsqUdkxPi8f0",
    authDomain: "e-buy-dc8a8.firebaseapp.com",
    databaseURL: "https://e-buy-dc8a8.firebaseio.com",
    projectId: "e-buy-dc8a8",
    storageBucket: "e-buy-dc8a8.appspot.com",
    messagingSenderId: "1006960217245",
    appId: "1:1006960217245:web:5031add4140f82d3f39874"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// export
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const fbAuthProvider = new firebase.auth.FacebookAuthProvider();
export const gitHubProvider = new firebase.auth.GithubAuthProvider();
