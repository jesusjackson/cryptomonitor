import { Component } from '@angular/core';
import { CryptoPricesComponent } from './components/crypto-prices/crypto-prices.component';
import { HistoricalPricesComponent } from './components/historical-prices/historical-prices.component';

@Component({
  selector: 'app-root',
  imports: [CryptoPricesComponent,
    HistoricalPricesComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'crypto-frontend';
}
