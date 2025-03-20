import { Test, TestingModule } from '@nestjs/testing';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';

describe('CryptoController', () => {
  let controller: CryptoController;
  let cryptoServiceMock: jest.Mocked<CryptoService>;

  beforeEach(async () => {
    cryptoServiceMock = {
      getPrices: jest.fn(),
      getHistoricalPrices: jest.fn(),
    } as unknown as jest.Mocked<CryptoService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoController],
      providers: [{ provide: CryptoService, useValue: cryptoServiceMock }],
    }).compile();

    controller = module.get<CryptoController>(CryptoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /crypto/prices', () => {
    it('should return live prices', async () => {
      const mockPrices = { 'TON/USDT': 2, 'USDT/TON': 0.5 };
      cryptoServiceMock.getPrices.mockResolvedValue(mockPrices);

      const result = await controller.getCryptoPrices();

      expect(result).toEqual(mockPrices);
      expect(cryptoServiceMock.getPrices).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if service fails', async () => {
      cryptoServiceMock.getPrices.mockRejectedValue(new Error('Service Error'));

      await expect(controller.getCryptoPrices()).rejects.toThrow('Service Error');
    });
  });

  describe('GET /crypto/historical', () => {
    it('should return historical prices', async () => {
      const mockHistory = [
        { id: 1, pair: 'TON/USDT', price: 2, updatedAt: new Date() },
      ];
      cryptoServiceMock.getHistoricalPrices.mockResolvedValue(mockHistory);

      const result = await controller.getHistoricalCryptoPrices();

      expect(result).toEqual(mockHistory);
      expect(cryptoServiceMock.getHistoricalPrices).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if service fails', async () => {
      cryptoServiceMock.getHistoricalPrices.mockRejectedValue(new Error('Service Error'));

      await expect(controller.getHistoricalCryptoPrices()).rejects.toThrow('Service Error');
    });
  });
});
