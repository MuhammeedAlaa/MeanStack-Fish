importScripts('https://www.gstatic.com/firebasejs/7.15.5/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/7.15.5/firebase-messaging.js'
);
firebase.initializeApp({
  apiKey: 'AIzaSyDj3259_UB8KdYF9RCcWkbuUK9aV7R9-Tk',
  authDomain: 'fish-94481.firebaseapp.com',
  databaseURL: 'https://fish-94481.firebaseio.com',
  projectId: 'fish-94481',
  storageBucket: 'fish-94481.appspot.com',
  messagingSenderId: '93073530574',
  appId: '1:93073530574:web:2befd0ee0ca174e99cba9f',
  measurementId: 'G-43PFY7LP1T'
});

const messaging = firebase.messaging();
