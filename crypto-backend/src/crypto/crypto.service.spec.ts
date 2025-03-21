import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { CryptoEntity } from './crypto.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

describe('CryptoService', () => {
  let service: CryptoService;
  let httpService: HttpService;
  let cryptoRepository: Repository<CryptoEntity>;
  let cacheManager: { get: jest.Mock; set: jest.Mock };

  beforeEach(async () => {
    const mockCryptoRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      find: jest.fn().mockResolvedValue([]),
    };

    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CryptoEntity),
          useValue: mockCryptoRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked_value'),
          },
        },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
    httpService = module.get<HttpService>(HttpService);
    cryptoRepository = module.get<Repository<CryptoEntity>>(getRepositoryToken(CryptoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch prices from CoinGecko successfully', async () => {
    const mockResponse: AxiosResponse = {
      data: {
        toncoin: { usd: 3.5 },
        tether: { usd: 1 },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

    const result = await service.getPrices('TON/USDT');
    expect(result).toEqual({ 'TON/USDT': 3.5 });
  });

  it('should store prices in cache', async () => {
    const mockResponse: AxiosResponse = {
      data: {
        toncoin: { usd: 3.5 },
        tether: { usd: 1 },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

    await service.getPrices('TON/USDT');
    expect(cacheManager.set).toHaveBeenCalledWith(
      'crypto_prices',
      { 'TON/USDT': 3.5, 'USDT/TON': 1 / 3.5 },
      300
    );
  });

  it('should retrieve cached prices if available', async () => {
    cacheManager.get.mockResolvedValue({ 'TON/USDT': 3.5, 'USDT/TON': 1 / 3.5 });

    const result = await service.getPrices('TON/USDT');
    expect(result).toEqual({ 'TON/USDT': 3.5 });
    expect(httpService.get).not.toHaveBeenCalled();
  });

  it('should retrieve historical prices from the database', async () => {
    const historicalPrices: CryptoEntity[] = [
      {
        id: 1,
        pair: 'TON/USDT',
        price: 3.5,
        tonPrice: 3.5,
        usdtPrice: 1,
        updatedAt: new Date(),
      } as CryptoEntity,
    ];

    jest.spyOn(cryptoRepository, 'find').mockResolvedValue(historicalPrices);

    const result = await service.getHistoricalPrices('TON/USDT');
    expect(result).toEqual(historicalPrices);
  });

  it('should save fetched prices to the database', async () => {
    const mockResponse: AxiosResponse = {
      data: {
        toncoin: { usd: 3.5 },
        tether: { usd: 1 },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

    await service.getPrices('TON/USDT');
    expect(cryptoRepository.save).toHaveBeenCalledWith([
      { pair: 'TON/USDT', price: 3.5 },
      { pair: 'USDT/TON', price: 1 / 3.5 },
    ]);
  });
});
