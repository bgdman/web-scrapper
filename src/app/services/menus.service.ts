import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MenusService {
  constructor(private http: HttpClient) {}

  getFromNode(shop: string) {
    return this.http.get(`http://localhost:3000/scrapper/${shop}`);
  }
}
