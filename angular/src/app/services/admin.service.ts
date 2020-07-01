import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor (private httpClient: HttpClient) {}
  setAuthHeader () {
    let headers = new HttpHeaders();
    this.loadToken();
    return headers.append('Authorization', `Bearer ${environment.authToken}`);
  }
  loadToken () {
    environment.authToken = localStorage.getItem('token');
  }
  getAdmins () {
    const headers = this.setAuthHeader();
    return this.httpClient.get(`api/v1/users/admins`, {
      headers
    });
  }
  editAdmin (user) {
    const headers = this.setAuthHeader();
    return this.httpClient.patch(`api/v1/users/updateMe`, user, {
      headers
    });
  }
}
