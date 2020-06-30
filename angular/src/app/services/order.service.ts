import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private REST_API_SERVER = 'http://localhost:3000/';

  constructor (private httpClient: HttpClient) {}

  editOrderInfo (order) {
    return this.httpClient.patch(
      `${this.REST_API_SERVER}api/v1/users/addressupdate`,
      order
    );
  }

  sendOrderInfo (order) {
    return this.httpClient.post(
      `${this.REST_API_SERVER}api/v1/users/address`,
      order
    );
  }
  getFishes () {
    return this.httpClient.get(`${this.REST_API_SERVER}api/v1/fishes/user`);
  }
  sendOrder (order) {
    return this.httpClient.patch(
      `${this.REST_API_SERVER}api/v1/orders/sendorder`,
      order
    );
  }
  deleteOrder (orderId) {
    return this.httpClient.delete(
      `${this.REST_API_SERVER}api/v1/orders/${orderId}`
    );
  }
}
