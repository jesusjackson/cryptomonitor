import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private apiUrl = 'http://localhost:3000/crypto';
  private static TON = 'TON/USDT'
  private static USDT = 'USDT/TON'
  private _selectedCurrency: WritableSignal<string> = signal('TON/USDT');
  selectedCurrency = this._selectedCurrency.asReadonly();
  private currencyOptions : string[] = [CryptoService.TON, CryptoService.USDT]

  constructor(private http: HttpClient) {}

  getLivePrices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/prices?selectedCurrency=${this.getSelectedCurrency()}`);
  }

  getHistoricalPrices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/historical?selectedCurrency=${this.getSelectedCurrency()}`);
  }

  getCurrencyOptions() : string[]{
    return this.currencyOptions
  }

  getSelectedCurrency(): string {
    return this.selectedCurrency();
  }
  setSelectedCurrency(selectedSymbol : string) : void {
    this._selectedCurrency.set(selectedSymbol);
  }
}
