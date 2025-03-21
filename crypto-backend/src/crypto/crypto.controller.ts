import { Controller, Get, Query } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('prices')
  async getCryptoPrices(@Query('selectedCurrency') selectedCurrency: string) {
    return this.cryptoService.getPrices(selectedCurrency);
  }

  @Get('historical')
  async getHistoricalCryptoPrices(@Query('selectedCurrency') selectedCurrency: string) {
    return this.cryptoService.getHistoricalPrices(selectedCurrency);
  }
}