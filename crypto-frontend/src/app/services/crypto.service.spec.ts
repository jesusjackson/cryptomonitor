import { TestBed } from '@angular/core/testing';
import { CryptoService } from './crypto.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('CryptoService', () => {
  let service: CryptoService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        CryptoService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    service = TestBed.inject(CryptoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch live cryptocurrency prices', () => {
    const mockResponse = { 'TON/USDT': 2 };

    service.getLivePrices().subscribe((prices) => {
      expect(prices).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/crypto/prices?selectedCurrency=TON/USDT');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch historical cryptocurrency prices', () => {
    const mockResponse = [
      { pair: 'TON/USDT', price: 2, updatedAt: '2024-03-19T12:00:00Z' }
    ];

    service.getHistoricalPrices().subscribe((history) => {
      expect(history).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/crypto/historical?selectedCurrency=TON/USDT');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle API errors for live prices', () => {
    service.getLivePrices().subscribe({
      next: () => fail('Should have failed with an error'),
      error: (error) => expect(error).toBeTruthy(),
    });

    const req = httpMock.expectOne('http://localhost:3000/crypto/prices?selectedCurrency=TON/USDT');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle API errors for historical prices', () => {
    service.getHistoricalPrices().subscribe({
      next: () => fail('Should have failed with an error'),
      error: (error) => expect(error).toBeTruthy(),
    });

    const req = httpMock.expectOne('http://localhost:3000/crypto/historical?selectedCurrency=TON/USDT');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
