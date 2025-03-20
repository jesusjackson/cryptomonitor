import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { CryptoEntity } from './crypto.entity';

@Injectable()
export class CryptoService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(CryptoEntity)
    private readonly cryptoRepository: Repository<CryptoEntity>,
  ) {}

  async getPrices() {
    try {
      console.log('🔵 Fetching prices from CoinGecko...');
      const coingeckoResponse = await firstValueFrom(
        this.httpService.get('https://api.coingecko.com/api/v3/simple/price?ids=toncoin,tether&vs_currencies=usd')
      );

      console.log('CoinGecko Response:', coingeckoResponse.data);

      if (!coingeckoResponse.data.toncoin || !coingeckoResponse.data.tether) {
        console.warn('Missing TON price from CoinGecko, falling back to CoinMarketCap...');
        const coinmarketcapResponse = await firstValueFrom(
          this.httpService.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=TON,USDT', {
            headers: { 'X-CMC_PRO_API_KEY': 'your_api_key_here' },
          })
        );

        console.log('CoinMarketCap Response:', coinmarketcapResponse.data);
        if (!coinmarketcapResponse.data.toncoin) {
          throw new Error('TON price is missing from both APIs');
        }

        return {
          'TON/USDT': coinmarketcapResponse.data.toncoin.usd / coinmarketcapResponse.data.tether.usd,
          'USDT/TON': coinmarketcapResponse.data.tether.usd / coinmarketcapResponse.data.toncoin.usd,
        };
      }

      return {
        'TON/USDT': coingeckoResponse.data.toncoin.usd / coingeckoResponse.data.tether.usd,
        'USDT/TON': coingeckoResponse.data.tether.usd / coingeckoResponse.data.toncoin.usd,
      };
    } catch (error) {
      console.error('Error fetching cryptocurrency prices:', error.message);
      throw new Error('Failed to fetch cryptocurrency prices');
    }
  }

  async getHistoricalPrices() {
    return await this.cryptoRepository.find({ order: { updatedAt: 'DESC' } });
  }
}