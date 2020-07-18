import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private REST_API_SERVER = 'http://localhost:3000/';

  constructor (private httpClient: HttpClient) {}

  editOrderInfo (order) {
    return this.httpClient.patch(
      `${environment.REST_API_SERVER}api/v1/users/addressupdate`,
      order
    );
  }

  sendOrderInfo (order) {
    return this.httpClient.post(
      `${environment.REST_API_SERVER}api/v1/users/address`,
      order
    );
  }
  getFishes () {
    return this.httpClient.get(
      `${environment.REST_API_SERVER}api/v1/fishes/user`
    );
  }
  sendOrder (order) {
    return this.httpClient.patch(
      `${environment.REST_API_SERVER}api/v1/orders/sendorder`,
      order
    );
  }
  deleteOrder (orderId) {
    return this.httpClient.delete(
      `${environment.REST_API_SERVER}api/v1/orders/${orderId}`
    );
  }
  getDays () {
    return this.httpClient.get(
      `${environment.REST_API_SERVER}api/v1/orders/days`
    );
  }
}
