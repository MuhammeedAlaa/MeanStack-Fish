import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
export default firebase;
import 'firebase/messaging';

// Initialize Firebase
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

//Define messaging object to deal with firebase messaging
const messaging = firebase.messaging();
messaging.usePublicVapidKey(
  'BKWjVvHDSC2wVNTGrh3EZZFjTJtt_Qrpm25UrskuFmRFT62apSs_rRfP_NtEzIxPvUwBTtCwmPlGSi1eUkaWW8w'
);
@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  massage;

  constructor () {}
  // Listen for token refresh
  monitorRefresh () {
    messaging.onTokenRefresh(() => {
      messaging
        .getToken()
        .then(refreshedToken => {
          console.log('Token refreshed.');
          localStorage.setItem('notificationToken', refreshedToken);
        })
        .catch(err => {
          console.log(err, 'Unable to retrieve new token');
          localStorage.setItem('notificationToken', undefined);
        });
    });
  }

  requestPermission () {
    messaging
      .requestPermission()
      .then(() => {
        console.log('Have Permission');
        return messaging.getToken();
      })
      .then(currentToken => {
        console.log(currentToken);
        localStorage.setItem('notificationToken', currentToken);
      })
      .catch(e => {
        console.log(e, 'Error Ocurred.');
        localStorage.setItem('notificationToken', undefined);
      });
  }

  receiveMessages () {
    messaging.onMessage(payload => {
      console.log('Message received. ', payload);
      this.massage = payload;
      this.currentMessage.next(payload);
      if (Notification.permission === 'granted') {
        const notification = new Notification(payload.notification.title, {
          icon: payload.notification.icon,
          body: payload.notification.body
        });
        if (localStorage.getItem('token')) {
          notification.onclick = e => {
            window.location.href = '/users';
          };
        } else {
          notification.onclick = e => {
            window.location.href = '/home';
          };
        }
      } else if (Notification.permission === 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            const notification = new Notification(payload.notification.title, {
              icon: payload.notification.icon,
              body: payload.notification.body
            });
            if (localStorage.getItem('token')) {
              notification.onclick = e => {
                window.location.href = '/users';
              };
            } else {
              notification.onclick = e => {
                window.location.href = '/home';
              };
            }
          }
        });
      }
    });
  }
}
