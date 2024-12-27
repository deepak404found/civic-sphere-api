import { RequestHandler } from 'express'
import z from 'zod'

export function validateRequestBody(schema: z.Schema<any>): RequestHandler {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body)
            next()
        } catch (error) {
            res.status(400).json(error)
        }
    }
}

export function validatePathVariables(schema: z.Schema<any>): RequestHandler {
    return (req, res, next) => {
        try {
            req.params = schema.parse(req.params)
            next()
        } catch (error) {
            res.status(400).json(error)
        }
    }
}

export function validateQueryParams(schema: z.Schema<any>): RequestHandler {
    return (req, res, next) => {
        try {
            schema.parse(req.query)
            next()
        } catch (error) {
            res.status(400).json(error)
        }
    }
}

// zod schema for list query params
export const listQueryParamsSchema = z.object({
    skip: z.coerce.number().int().min(0).default(0),
    limit: z.coerce.number().int().min(1).default(10),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
})

export type ListQueryParamsType = z.infer<typeof listQueryParamsSchema>

export const validateListQueryParams = validateQueryParams(listQueryParamsSchema)
