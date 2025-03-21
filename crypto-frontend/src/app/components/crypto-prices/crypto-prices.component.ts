import { Component, WritableSignal, signal, effect, inject } from '@angular/core';
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
export class CryptoPricesComponent {
  private cryptoService = inject(CryptoService);

  prices: WritableSignal<{ 'TON/USDT': number; 'USDT/TON': number } | null> = signal(null);

  constructor() {
    effect(() => {
      this.fetchPrices();
    });
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

  get priceValues(): Record<string, number> | null {
    return this.prices();
  }

  protected readonly Object = Object;
}
