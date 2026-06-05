import fs from 'fs'
import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'
import sharp from 'sharp'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }

    try {
        let meta
        try {
            meta = await sharp(req.file.buffer).metadata()
        } catch {
            return next(new BadRequestError('Проверьте ваш файл'))
        }

        if (!meta.format || !meta.width || !meta.height) {
            return next(new BadRequestError('Проверьте ваш файл'))
        }

        if (req.file.size < 2048) {
            return next(new BadRequestError('Размер файла слишком маленький'))
        }

        if (req.file.size > 1024 * 1024 * 10) {
            return next(new BadRequestError('Размер файла слишком большой'))
        }

        const upload = process.env.UPLOAD_PATH_TEMP
            ? path.join(__dirname, '../public', process.env.UPLOAD_PATH_TEMP)
            : path.join(__dirname, '../public')
        fs.mkdirSync(upload, { recursive: true })

        const newName = uuidv4() + '.' + meta.format
        const filePath = path.join(upload, newName)

        await sharp(req.file.buffer).toFile(filePath)
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${newName}`
            : `/${newName}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
