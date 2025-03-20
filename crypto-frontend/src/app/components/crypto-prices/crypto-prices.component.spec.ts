import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CryptoPricesComponent } from './crypto-prices.component';
import { CryptoService } from '../../services/crypto.service';
import { of } from 'rxjs';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

describe('CryptoPricesComponent', () => {
  let component: CryptoPricesComponent;
  let fixture: ComponentFixture<CryptoPricesComponent>;
  let cryptoServiceMock: jasmine.SpyObj<CryptoService>;

  beforeEach(async () => {
    cryptoServiceMock = jasmine.createSpyObj<CryptoService>('CryptoService', ['getLivePrices']);

    // ✅ Ensure `getLivePrices()` always returns an observable (prevents `subscribe` error)
    cryptoServiceMock.getLivePrices.and.returnValue(of({ 'TON/USDT': 2, 'USDT/TON': 0.5 }));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatCardModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        CryptoPricesComponent, // ✅ Use standalone component import
      ],
      providers: [
        { provide: CryptoService, useValue: cryptoServiceMock },
        provideHttpClient(withFetch()), // ✅ Modern HTTP client setup
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CryptoPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchPrices() when refresh button is clicked', () => {
    spyOn(component, 'fetchPrices');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(component.fetchPrices).toHaveBeenCalled();
  });

  it('should display prices when data is available', () => {
    fixture.detectChanges();
    expect(component.prices()).toEqual({ 'TON/USDT': 2, 'USDT/TON': 0.5 });
  });
});
