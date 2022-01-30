import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCuGCe9gyimvCsl_bRonIxlEhhN66ffrYQ',
  authDomain: 'livedoctor-3af95.firebaseapp.com',
  databaseURL: 'https://livedoctor-3af95-default-rtdb.firebaseio.com',
  projectId: 'livedoctor-3af95',
  storageBucket: 'livedoctor-3af95.appspot.com',
  messagingSenderId: '830516607896',
  appId: '1:830516607896:web:8bd925c0c5bc91e99e49ed',
  measurementId: 'G-G1CCQ24GT4',
};

const app = initializeApp(firebaseConfig);

const database = getFirestore();

export { database };

// import firebase from 'firebase';
// import 'firebase/database';

// const firebaseConfig = {
//   apiKey: 'AIzaSyCuGCe9gyimvCsl_bRonIxlEhhN66ffrYQ',
//   authDomain: 'livedoctor-3af95.firebaseapp.com',
//   databaseURL: 'https://livedoctor-3af95-default-rtdb.firebaseio.com',
//   projectId: 'livedoctor-3af95',
//   storageBucket: 'livedoctor-3af95.appspot.com',
//   messagingSenderId: '830516607896',
//   appId: '1:830516607896:web:8bd925c0c5bc91e99e49ed',
//   measurementId: 'G-G1CCQ24GT4',
// };

// const firebaseApp = firebase.initializeApp(firebaseConfig);

// const db = firebase.database();

// export { db };

// import firebase from 'firebase';
// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: 'AIzaSyCuGCe9gyimvCsl_bRonIxlEhhN66ffrYQ',
//   authDomain: 'livedoctor-3af95.firebaseapp.com',
//   databaseURL: 'https://livedoctor-3af95-default-rtdb.firebaseio.com',
//   projectId: 'livedoctor-3af95',
//   storageBucket: 'livedoctor-3af95.appspot.com',
//   messagingSenderId: '830516607896',
//   appId: '1:830516607896:web:8bd925c0c5bc91e99e49ed',
//   measurementId: 'G-G1CCQ24GT4',
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const db = firebase.database();

// const analytics = getAnalytics(app);
