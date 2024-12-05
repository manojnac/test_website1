// Initialize Firebase
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

// Initialize Firebase app and database
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.getDatabase(app);

// Helper functions
function generateVisitorID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Retrieve or set Visitor ID
let visitorID = localStorage.getItem('visitorID') || generateVisitorID();
localStorage.setItem('visitorID', visitorID);

// Track session data
let sessionStartTime = Date.now();
let hasNavigated = false;

// Function to send data to Firebase
function sendDataToFirebase(data) {
  const timestamp = new Date().toISOString();
  const ref = firebase.ref(db, `websiteData/${visitorID}/${timestamp}`);
  firebase.set(ref, data);
}

// Track Page View
function trackPageView() {
  const pageViewData = {
    type: "page_view",
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };
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
  sendDataToFirebase(sessionData);
});

// Track Navigation
window.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    hasNavigated = true; // User navigated to another page
  }
});

// Initial Page View
trackPageView();
