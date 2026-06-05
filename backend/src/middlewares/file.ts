import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { mkdirSync } from 'fs'
import { join, extname } from 'path'
import { v4 as uuidv4 } from 'uuid'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

// const storage = multer.diskStorage({
//     destination: (
//         _req: Request,
//         _file: Express.Multer.File,
//         cb: DestinationCallback
//     ) => {
//         const destinationPath = join(
//             __dirname,
//             process.env.UPLOAD_PATH_TEMP
//                 ? `../public/${process.env.UPLOAD_PATH_TEMP}`
//                 : '../public'
//         )

//         mkdirSync(destinationPath, { recursive: true })

//         cb(null, destinationPath)
//     },

//     filename: (
//         _req: Request,
//         file: Express.Multer.File,
//         cb: FileNameCallback
//     ) => {
//         cb(null, uuidv4() + extname(file.originalname))
//     },
// })

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}

const storage = multer.memoryStorage()

export default multer({ storage, fileFilter })
