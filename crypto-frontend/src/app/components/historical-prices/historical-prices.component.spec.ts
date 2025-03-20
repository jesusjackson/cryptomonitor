import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoricalPricesComponent } from './historical-prices.component';
import { provideHttpClient } from '@angular/common/http';
import { CryptoService } from '../../services/crypto.service';

describe('HistoricalPricesComponent', () => {
  let component: HistoricalPricesComponent;
  let fixture: ComponentFixture<HistoricalPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricalPricesComponent], // ✅ Standalone component import
      providers: [
        CryptoService, // ✅ Provide CryptoService
        provideHttpClient() // ✅ Provide HttpClient properly
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricalPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
