import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CryptoPricesComponent } from './components/crypto-prices/crypto-prices.component';
import { HistoricalPricesComponent } from './components/historical-prices/historical-prices.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { provideRouter } from '@angular/router';
import { appConfig } from './app.config';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule,
        CryptoPricesComponent,
        HistoricalPricesComponent,
      ],
      providers: [
        ...appConfig.providers,
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title "Crypto Tracker"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Crypto Tracker');
  });

  it('should contain the CryptoPricesComponent and HistoricalPricesComponent', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-crypto-prices')).toBeTruthy();
    expect(compiled.querySelector('app-historical-prices')).toBeTruthy();
  });
});
