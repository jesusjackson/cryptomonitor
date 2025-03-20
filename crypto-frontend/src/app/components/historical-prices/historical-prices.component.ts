import { Component, OnInit } from '@angular/core';
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
export class HistoricalPricesComponent implements OnInit {
  displayedColumns: string[] = ['pair', 'price', 'updatedAt'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.cryptoService.getHistoricalPrices().subscribe({
      next: (data) => {
        // Ensure that data is an array before setting it
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
