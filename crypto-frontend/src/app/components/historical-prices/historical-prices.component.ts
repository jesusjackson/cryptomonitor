import { Component, effect, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow, MatRow,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { CryptoService } from '../../services/crypto.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-historical-prices',
  standalone: true,
  templateUrl: './historical-prices.component.html',
  styleUrls: ['./historical-prices.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatTableModule
  ],
})
export class HistoricalPricesComponent {
  private cryptoService = inject(CryptoService);

  displayedColumns: string[] = ['pair', 'price', 'updatedAt'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor() {
    effect(() => {
      this.fetchHistoricalPrices();
    });
  }

  fetchHistoricalPrices(): void {
    this.cryptoService.getHistoricalPrices().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.dataSource.data = data;
        } else {
          console.error('Historical prices data is not an array:', data);
        }
      },
      error: (err) => {
        console.error('Error fetching historical prices:', err);
      }
    });
  }
}
