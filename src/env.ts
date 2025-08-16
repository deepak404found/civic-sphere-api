import { SwaggerThemeNameEnum } from 'swagger-themes'

export const vars = {
    PORT: process.env?.PORT ? parseInt(process.env.PORT) : 3001,
    PG_USER: process.env?.PG_USER || 'postgres',
    PG_HOST: process.env?.PG_HOST || 'localhost',
    PG_DATABASE: process.env?.PG_DATABASE || 'civic_sphere',
    PG_PASSWORD: process.env?.PG_PASSWORD || 'postgres',
    PG_PORT: process.env?.PG_PORT ? parseInt(process.env.PG_PORT) : 5432,
    PG_SSL: process.env?.PG_SSL === 'true' || false,
    ENABLE_PG_LOG: process.env?.ENABLE_PG_LOG === 'true' || false,

    // Swagger Configuration
    SWAGGER_THEME: process.env?.SWAGGER_THEME || SwaggerThemeNameEnum.ONE_DARK,
    SWAGGER_DOCS_PATH: process.env?.SWAGGER_DOCS_PATH || 'docs',
    SWAGGER_JSON_PATH: process.env?.SWAGGER_JSON_PATH || 'docs-json',
    SWAGGER_DEVELOPMENT_URL: process.env?.SWAGGER_DEVELOPMENT_URL || 'https://deepak-test.sample.com/',
    SWAGGER_PRODUCTION_URL: process.env?.SWAGGER_PRODUCTION_URL || 'https://dk404.sample.com/',
    SWAGGER_ENABLE: process.env?.SWAGGER_ENABLE !== 'false', // Default to true

    EMAIL: process.env?.EMAIL || 'sample@mail.com',
    EMAIL_PASS: process.env?.EMAIL_PASS || 'password',
    NODEMAILER_LOGGER: process.env?.NODEMAILER_LOGGER === 'true' || false,
    NODEMAILER_DEBUG: process.env?.NODEMAILER_DEBUG === 'true' || false,

    JWT_SECRET: process.env?.JWT_SECRET || 'secret',
    JWT_EXPIRY: process.env?.JWT_EXPIRY || '1h'
}
