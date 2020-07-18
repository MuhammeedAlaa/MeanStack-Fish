import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FishService {
  private REST_API_SERVER = 'http://localhost:3000/';
  constructor (private httpClient: HttpClient) {}

  setAuthHeader () {
    let headers = new HttpHeaders();
    this.loadToken();
    return headers.append('Authorization', `Bearer ${environment.authToken}`);
  }
  loadToken () {
    environment.authToken = localStorage.getItem('token');
  }
  getFishes () {
    const headers = this.setAuthHeader();
    let d = this.httpClient.get(`api/v1/fishes`, {
      headers
    });
    return d;
  }
  addFish (newFish) {
    const headers = this.setAuthHeader();
    return this.httpClient.post(`api/v1/fishes`, newFish, {
      headers
    });
  }
  editFish (editedFish, id) {
    const headers = this.setAuthHeader();
    return this.httpClient.patch(`api/v1/fishes/${id}`, editedFish, {
      headers
    });
  }
  deleteFish (deletedFish) {
    const headers = this.setAuthHeader();
    return this.httpClient.delete(`api/v1/fishes/${deletedFish._id}`, {
      headers
    });
  }
  getAmounts () {
    const headers = this.setAuthHeader();
    return this.httpClient.get(`api/v1/fishes/amounts`, {
      headers
    });
  }
  deleteFishes () {
    const headers = this.setAuthHeader();
    return this.httpClient.delete(`api/v1/fishes`, {
      headers
    });
  }
}
