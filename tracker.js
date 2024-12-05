// Import necessary Firebase modules from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVq9WeE1hqTdMsdT3miAUbTc9g0z0QjJ8",
  authDomain: "swat-173ca.firebaseapp.com",
  databaseURL: "https://swat-173ca-default-rtdb.firebaseio.com",
  projectId: "swat-173ca",
  storageBucket: "swat-173ca.firebasestorage.app",
  messagingSenderId: "948374024673",
  appId: "1:948374024673:web:b224c6b7262ebf927362a0",
  measurementId: "G-8HYY41WFS0"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Realtime Database
const db = getDatabase(app);

// Helper functions
function generateVisitorID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
console.log('Visitor ID:', visitorID);


// Retrieve or set Visitor ID
let visitorID = localStorage.getItem('visitorID') || generateVisitorID();
localStorage.setItem('visitorID', visitorID);

// Track session data
let sessionStartTime = Date.now();
let hasNavigated = false;
console.log('Session Start Time:', sessionStartTime);


// Function to send data to Firebase
function sendDataToFirebase(data) {
  const timestamp = new Date().toISOString();
  const refPath = `websiteData/${visitorID}/${timestamp}`;
  const dataRef = ref(db, refPath);
  set(dataRef, data);
    .then(() => {
      console.log('Data successfully written to Firebase:', data); // Success log
    })
    .catch((error) => {
      console.error('Error writing data to Firebase:', error); // Error log
    });// This writes data to Firebase Realtime Database
}

// Track Page View
function trackPageView() {
  const pageViewData = {
    type: "page_view",
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };
  console.log('Page View Data:', pageViewData);
  sendDataToFirebase(pageViewData);
}

// Track Session Duration
window.addEventListener('beforeunload', () => {
  const sessionEndTime = Date.now();
  const sessionDuration = (sessionEndTime - sessionStartTime) / 1000; // in seconds
  const sessionData = {
    type: "session",
    duration: sessionDuration,
    singlePageSession: !hasNavigated,
  };
  console.log('Session Data:', sessionData);
  sendDataToFirebase(sessionData);
});

// Track Navigation
window.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    hasNavigated = true; // User navigated to another page
    console.log('Navigation Detected:', hasNavigated); 
  }
});

// Initial Page View
trackPageView();
