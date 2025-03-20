import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from '../../services/crypto.service';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-crypto-prices',
  standalone: true,
  templateUrl: './crypto-prices.component.html',
  styleUrls: ['./crypto-prices.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
})
export class CryptoPricesComponent implements OnInit {
  // Your existing signal property
  prices: WritableSignal<{ 'TON/USDT': number; 'USDT/TON': number } | null> = signal(null);

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.fetchPrices();
  }

  fetchPrices(): void {
    this.cryptoService.getLivePrices().subscribe({
      next: (data) => this.prices.set(data),
      error: (err) => {
        console.error('Error fetching prices:', err);
        this.prices.set(null);
      },
    });
  }

  // New getter to return the underlying value of the signal.
  get priceValues(): { 'TON/USDT': number; 'USDT/TON': number } | null {
    return this.prices();
  }
}
