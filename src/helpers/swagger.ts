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
            title: 'Chips MIS Docs',
            version,
            description: 'Chips MIS API Documentation'
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
                url: `http://localhost:${vars.PORT}`
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
            url: '/docs.json'
        }
    },
    apis: ['./src/routers/*.routes.ts', './src/schema/*.ts', './src/routers/**/*.openapi.yaml', './src/schema/**/*.openapi.yaml']
}

export const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app: Express, port: number) {
    const theme = new SwaggerTheme()

    // Swagger page
    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customSiteTitle: 'Chips MIS Docs',
            explorer: true,
            customCss: theme.getBuffer(vars.SWAGGER_THEME as SwaggerThemeNameEnum)
        })
    )

    // Docs in JSON format
    app.get('/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })

    logger.info(`Docs available at http://localhost:${port}/docs`)
}

export default swaggerDocs
