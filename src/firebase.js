import { initializeApp } from 'firebase/app';
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
