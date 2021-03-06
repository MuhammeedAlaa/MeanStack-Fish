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
    return this.httpClient.get(
      `${environment.REST_API_SERVER}api/v1/users/admins`,
      {
        headers
      }
    );
  }
  getAdminNotifications () {
    const headers = this.setAuthHeader();
    return this.httpClient.get(
      `${environment.REST_API_SERVER}api/v1/users/notifications`,
      {
        headers
      }
    );
  }
  editAdmin (user) {
    const headers = this.setAuthHeader();
    return this.httpClient.patch(
      `${environment.REST_API_SERVER}api/v1/users/updateMe`,
      user,
      {
        headers
      }
    );
  }
  getDays () {
    return this.httpClient.get(
      `${environment.REST_API_SERVER}api/v1/orders/days`
    );
  }
  addDay (newDay) {
    const headers = this.setAuthHeader();
    return this.httpClient.post(
      `${environment.REST_API_SERVER}api/v1/users/days`,
      newDay,
      {
        headers
      }
    );
  }
  editDay (editedDay) {
    const headers = this.setAuthHeader();
    return this.httpClient.patch(
      `${environment.REST_API_SERVER}api/v1/users/days/${editedDay._id}`,
      editedDay,
      {
        headers
      }
    );
  }
  deleteDay (deletedDay) {
    const headers = this.setAuthHeader();
    return this.httpClient.delete(
      `${environment.REST_API_SERVER}api/v1/users/days/${deletedDay._id}`,
      {
        headers
      }
    );
  }
  deleteDays () {
    const headers = this.setAuthHeader();
    return this.httpClient.delete(
      `${environment.REST_API_SERVER}api/v1/users/days`,
      {
        headers
      }
    );
  }
}
