import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: any,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}

const storage = multer.memoryStorage()

export default multer({ storage, fileFilter })
