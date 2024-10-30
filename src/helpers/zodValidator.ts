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
