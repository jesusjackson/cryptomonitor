import { Controller, Get } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('prices')
  async getCryptoPrices() {
    return this.cryptoService.getPrices();
  }

  @Get('historical')
  async getHistoricalCryptoPrices() {
    return this.cryptoService.getHistoricalPrices();
  }
}