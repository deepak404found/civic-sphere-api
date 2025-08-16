import { Express, Request, Response } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { version } from '../../package.json'
import { logger } from './logger'
import { vars } from '../env'
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '🏛️ Civic-Sphere-API',
            version,
            description:
                'A comprehensive Node.js + Express API for managing civic infrastructure including departments, users, and districts with role-based access control and Swagger SDK integration. This API provides secure authentication with JWT tokens, role-based access control for different user levels (Super Admin, Admin, User), comprehensive department management, user onboarding processes, password reset functionality, and dashboard analytics. Built with TypeScript, PostgreSQL, and Drizzle ORM for robust database operations.'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        servers: [
            {
                url: `http://localhost:${vars.PORT}`,
                description: '🖥️ Local Development Server'
            },
            {
                url: vars.SWAGGER_DEVELOPMENT_URL,
                description: '🚀 Development Environment'
            },
            {
                url: vars.SWAGGER_PRODUCTION_URL,
                description: '🌍 Production Environment'
            }
        ],
        tags: [
            {
                name: 'User',
                description:
                    'User management operations for admins and super admins. Includes CRUD operations with role-based access control'
            },
            {
                name: 'Department',
                description:
                    'Department management for civic organizations. Super admins can access all departments while admins manage their own'
            },
            {
                name: 'Dashboard',
                description: 'Analytics and reporting endpoints for business intelligence and civic management insights'
            },
            {
                name: 'Onboarding',
                description: 'User onboarding and account setup processes'
            },
            {
                name: 'ResetPassword',
                description: 'Password reset functionality using OTP verification for enhanced security'
            }
        ],
        externalDocs: {
            description: '📖 OpenAPI Specification (JSON)',
            url: `/${vars.SWAGGER_JSON_PATH}`
        }
    },
    apis: ['./src/routers/*.routes.ts', './src/schema/*.ts', './src/routers/**/*.openapi.yaml', './src/schema/**/*.openapi.yaml']
}

export const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app: Express, port: number) {
    // Check if Swagger should be enabled
    if (!vars.SWAGGER_ENABLE) {
        logger.info('Swagger documentation is disabled')
        return
    }

    try {
        const theme = new SwaggerTheme()

        // Swagger page
        app.use(
            `/${vars.SWAGGER_DOCS_PATH}`,
            swaggerUi.serve,
            swaggerUi.setup(swaggerSpec, {
                customSiteTitle: '🏛️ Civic-Sphere-API Documentation',
                customCss: theme.getBuffer(vars.SWAGGER_THEME as SwaggerThemeNameEnum),
                customfavIcon: 'https://img.icons8.com/color/48/000000/api-settings.png',
                swaggerOptions: {
                    persistAuthorization: true,
                    filter: true,
                    showRequestDuration: true,
                    syntaxHighlight: {
                        activated: true,
                        theme: 'monokai'
                    },
                    deepLinking: true,
                    displayOperationId: false,
                    defaultModelsExpandDepth: 1,
                    defaultModelExpandDepth: 1
                }
            })
        )

        // Docs in JSON format
        app.get(`/${vars.SWAGGER_JSON_PATH}`, (req: Request, res: Response) => {
            res.setHeader('Content-Type', 'application/json')
            res.send(swaggerSpec)
        })

        // Enhanced logging with server URLs
        const baseUrl = `http://localhost:${port}`

        logger.info(`🚀 Server is running!`)
        logger.info(`🔗 API Base URL: ${baseUrl}`)
        logger.info(`📝 API Documentation: ${baseUrl}/${vars.SWAGGER_DOCS_PATH}`)
        logger.info(`📦 OpenAPI Spec: ${baseUrl}/${vars.SWAGGER_JSON_PATH}`)
    } catch (error) {
        logger.error('Error setting up Swagger documentation:', error)
    }
}

export default swaggerDocs
