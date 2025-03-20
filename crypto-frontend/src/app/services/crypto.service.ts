import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private apiUrl = 'http://localhost:3000/crypto';

  constructor(private http: HttpClient) {}

  getLivePrices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/prices`);
  }

  getHistoricalPrices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/historical`);
  }
}
