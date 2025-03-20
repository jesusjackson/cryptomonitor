import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { CryptoEntity } from './crypto.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(CryptoEntity)
    private readonly cryptoRepository: Repository<CryptoEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async getPrices() {
    const cacheKey = 'crypto_prices';
    const cachedPrices = await this.cacheManager.get(cacheKey);
    if (cachedPrices) {
      console.log('⚡ Serving prices from cache');
      return cachedPrices;
    }

    try {
      console.log('🔵 Fetching prices from CoinGecko...');
      const coingeckoResponse = await firstValueFrom(
        this.httpService.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=toncoin,tether&vs_currencies=usd'
        )
      );

      let prices;
      // If CoinGecko doesn't return both tokens, fallback to CoinMarketCap.
      if (!coingeckoResponse.data.toncoin || !coingeckoResponse.data.tether) {
        console.warn('Missing TON price from CoinGecko, falling back to CoinMarketCap...');
        const coinmarketcapApiKey = this.configService.get<string>('COINMARKETCAP_API_KEY');
        if (!coinmarketcapApiKey) {
          throw new Error('CoinMarketCap API key not provided');
        }
        const coinmarketcapResponse = await firstValueFrom(
          this.httpService.get(
            'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=TON,USDT',
            { headers: { 'X-CMC_PRO_API_KEY': coinmarketcapApiKey } }
          )
        );
        const data = coinmarketcapResponse.data.data;
        if (
          !data.TON ||
          !data.TON.quote ||
          !data.TON.quote.USD ||
          !data.USDT ||
          !data.USDT.quote ||
          !data.USDT.quote.USD
        ) {
          throw new Error('TON price is missing from both APIs');
        }
        prices = {
          'TON/USDT': data.TON.quote.USD.price / data.USDT.quote.USD.price,
          'USDT/TON': data.USDT.quote.USD.price / data.TON.quote.USD.price,
        };
      } else {
        prices = {
          'TON/USDT': coingeckoResponse.data.toncoin.usd / coingeckoResponse.data.tether.usd,
          'USDT/TON': coingeckoResponse.data.tether.usd / coingeckoResponse.data.toncoin.usd,
        };
      }

      // Save the fetched prices to the database for historical records
      await this.cryptoRepository.save([
        { pair: 'TON/USDT', price: prices['TON/USDT'] },
        { pair: 'USDT/TON', price: prices['USDT/TON'] },
      ]);

      // Cache the result for 5 minutes (300 seconds)
      await this.cacheManager.set(cacheKey, prices, 300);
      return prices;
    } catch (error) {
      console.error('Error fetching cryptocurrency prices:', error.message);
      throw new Error('Failed to fetch cryptocurrency prices');
    }
  }

  async getHistoricalPrices() {
    return await this.cryptoRepository.find({ order: { updatedAt: 'DESC' } });
  }
}
