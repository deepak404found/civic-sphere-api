import { Router } from 'express'
import { db, mailTransporter } from '../../../conn'
import { vars } from '../../../env'
import { z } from 'zod'
import { validateRequestBody } from '../../../helpers/zodValidator'
import { BadRequestError, errorHandler, NotFoundError } from '../../../helpers/errorHandler'
import { resetPasswordTable, usersTable } from '../../../db/schema'
import { fetchUserByEmail, hashPassword } from '../../../controllers/users'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { logger } from '../../../helpers/logger'

const resetPassRouter = Router()

const generateOtpSchema = z.object({
    email: z.string().email()
})

// generate a otp and send it to the user to reset the password
resetPassRouter.post('/generateOtp', validateRequestBody(generateOtpSchema), async (req, res) => {
    try {
        const { email } = req.body as z.infer<typeof generateOtpSchema>

        // check user exists by email
        const user = await fetchUserByEmail(email)
        if (user instanceof Error) throw user

        // generate otp 6 digit
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // save otp in db with user id
        const resetPass = await db
            .insert(resetPasswordTable)
            .values({
                user: user.id,
                otp: await bcrypt.hash(otp, 10)
            })
            .returning()
            .then((result) => {
                return result[0]
            })
            .catch((err) => {
                console.error(err)
                throw new Error('Error inserting reset password')
            })

        // send mail with defined transport object
        // const info = await mailTransporter.sendMail({
        //     from: vars.EMAIL, // sender address
        //     to: 'deepakyadu404@gmail.com', // list of receivers
        //     subject: 'OTP for password reset',
        //     text: `Your OTP is 1234`
        // })

        // send otp to user email
        logger.info(`Sending OTP to ${email}`)
        const sendMail = await mailTransporter.sendMail({
            from: vars.EMAIL, // sender address
            to: email, // list of receivers
            subject: 'OTP for password reset',
            text: `Hello ${user.full_name}, You have requested to reset your password. Use this OTP to reset your password: ${otp}`
        })

        if (sendMail.rejected.length > 0) {
            throw new Error('Error sending mail')
        }

        res.status(200).json({
            message: 'OTP sent successfully',
            payload: {
                email: user.email,
                request_id: resetPass.id
            }
        })
    } catch (err) {
        const toReturn = errorHandler(err)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

const verifyOtpSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
    request_id: z.string()
})

// verify otp
resetPassRouter.post('/verifyOtp', validateRequestBody(verifyOtpSchema), async (req, res) => {
    try {
        const { email, otp, request_id } = req.body as z.infer<typeof verifyOtpSchema>

        // check user exists by email
        const user = await fetchUserByEmail(email)
        if (user instanceof Error) throw user

        // fetch reset password by user id and request id
        const resetPass = await db.query.resetPasswordTable.findFirst({
            where: (resetPassword, { and, eq }) => and(eq(resetPassword.user, user.id), eq(resetPassword.id, request_id))
        })
        if (!resetPass) throw new NotFoundError('Request not found')

        // verify otp
        const validOtp = await bcrypt.compare(otp, resetPass.otp)
        if (!validOtp) throw new BadRequestError('Invalid OTP')

        // update reset password to verified
        await db
            .update(resetPasswordTable)
            .set({
                verified: true
            })
            .where(eq(resetPasswordTable.id, resetPass.id))
            .execute()

        res.status(200).json({
            message: 'OTP verified successfully',
            payload: true
        })
    } catch (err) {
        const toReturn = errorHandler(err)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

const resetPassSchema = z.object({
    request_id: z.string(),
    password: z.string().min(8).max(20)
})

// reset password
resetPassRouter.post('/', validateRequestBody(resetPassSchema), async (req, res) => {
    try {
        const { password, request_id } = req.body as z.infer<typeof resetPassSchema>

        // check reset password exists by request id and verified
        const resetPass = await db.query.resetPasswordTable.findFirst({
            where: (resetPassword, { and, eq }) => and(eq(resetPassword.id, request_id), eq(resetPassword.verified, true))
        })
        if (!resetPass) throw new NotFoundError('Request not found or not verified')

        // update user password
        const hashedPassword = await hashPassword(password)
        await db
            .update(usersTable)
            .set({
                pass: hashedPassword
            })
            .where(eq(usersTable.id, resetPass.user))
            .execute()

        // remove reset password
        await db.delete(resetPasswordTable).where(eq(resetPasswordTable.id, resetPass.id)).execute()

        res.status(200).json({
            message: 'Password reset successfully',
            payload: true
        })
    } catch (err) {
        const toReturn = errorHandler(err)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

export default resetPassRouter
