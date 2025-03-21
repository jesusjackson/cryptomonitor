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

  async getPrices(selectedCurrency: string) {
    const cacheKey = 'crypto_prices';
    const cachedPrices = await this.cacheManager.get<Record<string, number>>(cacheKey);

    if (cachedPrices) {
      console.log('⚡ Serving prices from cache');
      return {
        [selectedCurrency]: cachedPrices[selectedCurrency],
      };
    }

    try {
      console.log('🔵 Fetching prices from CoinGecko...');
      const coingeckoResponse = await firstValueFrom(
        this.httpService.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=toncoin,tether&vs_currencies=usd'
        )
      );

      let prices: Record<string, number>;

      // Fallback to CoinMarketCap if any token is missing
      if (!coingeckoResponse.data.toncoin || !coingeckoResponse.data.tether) {
        console.warn('Missing TON price from CoinGecko, falling back to CoinMarketCap...');
        const coinmarketcapApiKey = this.configService.get<string>('COINMARKETCAP_API_KEY');
        if (!coinmarketcapApiKey) {
          throw new Error('CoinMarketCap API key not provided');
        }

        const cmcResponse = await firstValueFrom(
          this.httpService.get(
            'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=TON,USDT',
            {
              headers: { 'X-CMC_PRO_API_KEY': coinmarketcapApiKey },
            }
          )
        );

        const data = cmcResponse.data.data;

        if (
          !data.TON?.quote?.USD?.price ||
          !data.USDT?.quote?.USD?.price
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

      // Save both directions to DB for historical purposes
      await this.cryptoRepository.save([
        { pair: 'TON/USDT', price: prices['TON/USDT'] },
        { pair: 'USDT/TON', price: prices['USDT/TON'] },
      ]);

      // Cache for 5 minutes
      await this.cacheManager.set(cacheKey, prices, 300);

      if (!prices[selectedCurrency]) {
        throw new Error(`Price not available for selected pair: ${selectedCurrency}`);
      }

      return {
        [selectedCurrency]: prices[selectedCurrency],
      };
    } catch (error) {
      console.error('Error fetching cryptocurrency prices:', error.message);
      throw new Error('Failed to fetch cryptocurrency prices');
    }
  }

  async getHistoricalPrices(selectedCurrency: string) {
    return await this.cryptoRepository.find({
      where: { pair: selectedCurrency },
      order: { updatedAt: 'DESC' },
    });
  }
}
