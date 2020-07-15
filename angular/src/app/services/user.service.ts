import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private REST_API_SERVER = 'http://localhost:3000/';

  constructor (private httpClient: HttpClient) {}

  loadToken () {
    environment.authToken = localStorage.getItem('token');
  }
  setAuthHeader () {
    let headers = new HttpHeaders();
    this.loadToken();
    return headers.append('Authorization', `Bearer ${environment.authToken}`);
  }
  getOrders () {
    const headers = this.setAuthHeader();
    return this.httpClient.get(
      `${this.REST_API_SERVER}api/v1/orders/getorders`,
      {
        headers
      }
    );
  }
  sendOrders (orderId) {
    const headers = this.setAuthHeader();
    return this.httpClient.patch(
      `${this.REST_API_SERVER}api/v1/orders/ordersent`,
      { _id: orderId },
      { headers }
    );
  }
}
