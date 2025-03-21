import { Component, inject } from '@angular/core';
import { CryptoPricesComponent } from './components/crypto-prices/crypto-prices.component';
import { HistoricalPricesComponent } from './components/historical-prices/historical-prices.component';
import { CryptoService } from './services/crypto.service';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-root',
  imports: [CryptoPricesComponent,
    HistoricalPricesComponent,
    MatSelect, MatOption],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'crypto-frontend';
  currencyOptions : string[];
  selectedOption : string;
  private cryptoService = inject(CryptoService);
  constructor() {
    this.currencyOptions = this.cryptoService.getCurrencyOptions();
    this.selectedOption = this.currencyOptions[0];
    console.log(this.currencyOptions, this.selectedOption);
  }
  onSelectionChange(selectedValue: string){
    this.selectedOption = selectedValue;
    this.cryptoService.setSelectedCurrency(selectedValue);
  }
}
