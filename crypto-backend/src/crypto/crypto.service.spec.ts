import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CryptoEntity } from './crypto.entity';
import { Repository } from 'typeorm';
import { of, throwError } from 'rxjs';

describe('CryptoService', () => {
  let service: CryptoService;
  let httpService: HttpService;
  let cryptoRepository: jest.Mocked<Repository<CryptoEntity>>;

  beforeEach(async () => {
    const mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<CryptoEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
        {
          provide: getRepositoryToken(CryptoEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
    httpService = module.get<HttpService>(HttpService);
    cryptoRepository = module.get(getRepositoryToken(CryptoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch cryptocurrency prices from CoinGecko', async () => {
    const mockResponse = {
      data: {
        toncoin: { usd: 2 },
        tether: { usd: 1 },
      },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse) as any);

    const prices = await service.getPrices();

    expect(prices).toEqual({ 'TON/USDT': 2, 'USDT/TON': 0.5 });
  });

  it('should fallback to CoinMarketCap if CoinGecko is missing TON price', async () => {
    const coingeckoResponse = { data: { tether: { usd: 1 } } }; // No TON price
    const coinmarketcapResponse = { data: { toncoin: { usd: 2 }, tether: { usd: 1 } } };

    jest.spyOn(httpService, 'get')
      .mockReturnValueOnce(of(coingeckoResponse) as any)
      .mockReturnValueOnce(of(coinmarketcapResponse) as any);

    const prices = await service.getPrices();

    expect(prices).toEqual({ 'TON/USDT': 2, 'USDT/TON': 0.5 });
  });

  it('should throw an error if both APIs fail', async () => {
    jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('API Error')));

    await expect(service.getPrices()).rejects.toThrow('Failed to fetch cryptocurrency prices');
  });

  it('should retrieve historical prices from the database', async () => {
    const mockHistory = [
      { id: 1, pair: 'TON/USDT', price: 2, updatedAt: new Date() },
    ];

    cryptoRepository.find.mockResolvedValue(mockHistory);

    const history = await service.getHistoricalPrices();

    expect(history).toEqual(mockHistory);
  });
});
