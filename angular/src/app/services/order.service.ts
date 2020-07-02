import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor (private httpClient: HttpClient) {}

  editOrderInfo (order) {
    return this.httpClient.patch(`api/v1/users/addressupdate`, order);
  }

  sendOrderInfo (order) {
    return this.httpClient.post(`api/v1/users/address`, order);
  }
  getFishes () {
    return this.httpClient.get(`api/v1/fishes/user`);
  }
  sendOrder (order) {
    return this.httpClient.patch(`api/v1/orders/sendorder`, order);
  }
  deleteOrder (orderId) {
    return this.httpClient.delete(`api/v1/orders/${orderId}`);
  }
}
