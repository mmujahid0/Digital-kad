// Firebase Configuration
// ⚠️ IMPORTANT: Replace these values with your Firebase project config
// Get these values from Firebase Console > Project Settings

const firebaseConfig = {
  apiKey: "AIzaSyASSU6rwk4zrnuMWU8DTVhU45bqYlbjBos",
  authDomain: "digital-kad-rsvp.firebaseapp.com",
  databaseURL: "https://digital-kad-rsvp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "digital-kad-rsvp",
  storageBucket: "digital-kad-rsvp.firebasestorage.app",
  messagingSenderId: "712058674556",
  appId: "1:712058674556:web:7578558cc82b32488d58f9",
  measurementId: "G-JJQS15K319"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get database reference
const database = firebase.database();

// Sign in anonymously (required for database access)
firebase.auth().signInAnonymously()
    .catch((error) => {
        console.error('Auth error:', error);
    });

console.log('✅ Firebase initialized successfully');
