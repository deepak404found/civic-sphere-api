export const vars = {
    PROT: parseInt(process.env.PORT) || 3001,
    PG_USER: process.env.PG_USER || 'postgres',
    PG_HOST: process.env.PG_HOST || 'localhost',
    PG_DATABASE: process.env.PG_DATABASE || 'postgres',
    PG_PASSWORD: process.env.PG_PASSWORD || 'postgres',
    PG_PORT: parseInt(process.env.PG_PORT) || 5432
}
