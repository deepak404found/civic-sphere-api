export const vars = {
    PORT: process.env?.PORT ? parseInt(process.env.PORT) : 3001,
    PG_USER: process.env?.PG_USER || 'dbadmin',
    PG_HOST: process.env?.PG_HOST || 'localhost',
    PG_DATABASE: process.env?.PG_DATABASE || 'chips',
    PG_PASSWORD: process.env?.PG_PASSWORD || 'admin@123',
    PG_PORT: process.env?.PG_PORT ? parseInt(process.env.PG_PORT) : 5432,
    PG_SSL: process.env?.PG_SSL === 'true' || false,
    ENABLE_PG_LOG: process.env?.ENABLE_PG_LOG === 'true' || false,

    JWT_SECRET: process.env?.JWT_SECRET || 'secret',
    JWT_EXPIRY: process.env?.JWT_EXPIRY || '1h'
}
