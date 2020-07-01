import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  private REST_API_SERVER = 'http://localhost:3000/';

  constructor (private httpClient: HttpClient) {}

  sendRegistrationUserRequest (user) {
    const headers = this.setAuthHeader();
    return this.httpClient.post(
      `${this.REST_API_SERVER}api/v1/users/signup`,
      user,
      { headers }
    );
  }

  sendLoginUserRequest (user) {
    return this.httpClient.post(
      `${this.REST_API_SERVER}api/v1/users/login`,
      user
    );
  }
  name () {
    return localStorage.getItem('name');
  }
  storeClientData (token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('name', user.name);
    this.user = user;
    environment.authToken = token;
  }
  setAuthHeader () {
    let headers = new HttpHeaders();
    this.loadToken();
    return headers.append('Authorization', `Bearer ${environment.authToken}`);
  }
  loadToken () {
    environment.authToken = localStorage.getItem('token');
  }
  sendTokenToServer () {
    if (this.loggedIn()) {
      if (localStorage.getItem('notificationToken')) {
        const headers = this.setAuthHeader();
        return this.httpClient.patch(
          `${this.REST_API_SERVER}api/v1/users/registration-token`,
          { regToken: localStorage.getItem('notificationToken') },
          { headers }
        );
      }
    }
  }

  logout () {
    environment.authToken = undefined;
    this.user = undefined;
    localStorage.clear();
  }

  loggedIn () {
    return !helper.isTokenExpired(localStorage.getItem('token'));
  }
}
