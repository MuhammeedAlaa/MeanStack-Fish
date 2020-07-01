import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  constructor (private angularFireMessaging: AngularFireMessaging) {
    angularFireMessaging.onMessage(payload => {
      console.log(payload);
    });
  }

  requestPermission () {
    this.angularFireMessaging.requestToken.subscribe(
      token => {
        localStorage.setItem('notificationToken', token);
      },
      err => {
        console.error('Unable to get permission to notify.', err);
        localStorage.setItem('notificationToken', undefined);
      }
    );
  }
  receiveMessage () {
    console.log('eopwqkfpqwef');

    this.angularFireMessaging.messages.subscribe(payload => {
      console.log('new message received. ', payload);
      this.currentMessage.next(payload);
    });
  }
}
