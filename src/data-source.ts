import { DataSource } from 'typeorm';
import { CaseLaw } from './case-law/case-law.entity';
import { getEnvOrFail } from './utils';

const baseConfig = {
    type: 'postgres' as const,
    host: getEnvOrFail('POSTGRES_HOST'),
    port: parseInt(getEnvOrFail('POSTGRES_PORT'), 10),
    username: getEnvOrFail('POSTGRES_USER'),
    password: getEnvOrFail('POSTGRES_PASSWORD'),
    database: getEnvOrFail('POSTGRES_DB'),
    entities: [CaseLaw],
    synchronize: false,
    logging: true,
};

export default new DataSource({
    ...baseConfig,
    migrations: ['dist/migrations/*{.ts,.js}'],
});

export const appDataSourceConfig = baseConfig;