import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { CryptoEntity } from './crypto.entity';

describe('CryptoEntity (pg-mem)', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    try {
      const db = newDb();

      db.public.registerFunction({
        name: 'now',
        returns: DataType.timestamp,
        implementation: () => new Date(),
      });

      db.public.registerFunction({
        name: 'current_database',
        returns: DataType.text,
        implementation: () => 'test-db',
      });

      db.public.registerFunction({
        name: 'version',
        returns: DataType.text,
        implementation: () => 'PostgreSQL 13.3 on pg-mem', // Mock version
      });

      dataSource = await db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: [CryptoEntity],
        synchronize: true,
      });

      await dataSource.initialize();
    } catch (error) {
      console.error('Error initializing in-memory database:', error);
      throw error;
    }
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('should define the entity with correct structure', async () => {
    const repo = dataSource.getRepository(CryptoEntity);

    const entity = new CryptoEntity();
    entity.pair = 'TON/USDT';
    entity.price = 2.0;

    const savedEntity = await repo.save(entity);
    expect(savedEntity.id).toBeDefined();
    expect(savedEntity.updatedAt).toBeInstanceOf(Date);
    expect(savedEntity.pair).toBe('TON/USDT');
    expect(savedEntity.price).toBe(2.0);
  });

  it('should retrieve saved data correctly', async () => {
    const repo = dataSource.getRepository(CryptoEntity);

    const savedEntity = await repo.save({ pair: 'USDT/TON', price: 0.5 });
    const retrievedEntity = await repo.findOneBy({ id: savedEntity.id });

    expect(retrievedEntity).toBeDefined();
    expect(retrievedEntity?.pair).toBe('USDT/TON');
    expect(retrievedEntity?.price).toBe(0.5);
  });
});
