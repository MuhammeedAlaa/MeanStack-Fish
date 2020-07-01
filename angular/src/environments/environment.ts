// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  REST_API_SERVER: 'http://localhost:3000/api/v1/',
  authToken: '',
  firebase: {
    apiKey: 'AIzaSyDj3259_UB8KdYF9RCcWkbuUK9aV7R9-Tk',
    authDomain: 'fish-94481.firebaseapp.com',
    databaseURL: 'https://fish-94481.firebaseio.com',
    projectId: 'fish-94481',
    storageBucket: 'fish-94481.appspot.com',
    messagingSenderId: '93073530574',
    appId: '1:93073530574:web:2befd0ee0ca174e99cba9f',
    measurementId: 'G-43PFY7LP1T'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
