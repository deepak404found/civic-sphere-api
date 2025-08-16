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
            title: 'Civic Sphere API',
            version,
            description: 'Civic Sphere API Documentation'
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
                description: 'Local Server'
            },
            {
                url: vars.SWAGGER_DEVELOPMENT_URL,
                description: 'Development Server'
            },
            {
                url: vars.SWAGGER_PRODUCTION_URL,
                description: 'Production Server'
            }
        ],
        tags: [
            {
                name: 'Onboarding',
                description: 'Onboarding related routes'
            },
            {
                name: 'ResetPassword',
                description: 'Reset password related routes. User can reset their password using OTP verification'
            },
            {
                name: 'User',
                description:
                    'User related routes only for admins and super admins. Super admins can access all users while admins can access only their department users'
            },
            {
                name: 'Department',
                description:
                    'Department related routes only for admins and super admins. Super admins can access all departments while admins can access only their department'
            },
            {
                name: 'Dashboard',
                description: 'Dashboard related routes only for admins and super admins to get summary according to their accessibilities'
            }
        ],
        externalDocs: {
            description: 'Docs in JSON format',
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
                customSiteTitle: 'Civic Sphere API Docs',
                explorer: true,
                customCss: theme.getBuffer(vars.SWAGGER_THEME as SwaggerThemeNameEnum),
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

        // Console output for better visibility
        console.log('\n🚀 Server is running!')
        console.log(`🔗 API Base URL: ${baseUrl}`)
        console.log(`📝 API Documentation: ${baseUrl}/${vars.SWAGGER_DOCS_PATH}`)
        console.log(`📦 OpenAPI Spec: ${baseUrl}/${vars.SWAGGER_JSON_PATH}`)
        console.log('')
    } catch (error) {
        logger.error('Error setting up Swagger documentation:', error)
        console.error('❌ Failed to setup Swagger documentation:', error)
    }
}

export default swaggerDocs
