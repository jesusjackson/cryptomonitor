import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CryptoPricesComponent } from './components/crypto-prices/crypto-prices.component';
import { HistoricalPricesComponent } from './components/historical-prices/historical-prices.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Angular Material Components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    CryptoPricesComponent,
    HistoricalPricesComponent,
    AppComponent,
    // Angular Material Modules
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  providers: [],
})
export class AppModule { }
