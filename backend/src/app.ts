import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { doubleCsrf } from 'csrf-csrf';
import { DB_ADDRESS, ORIGIN_ALLOW } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'
import { sanitizeReq } from './middlewares/sanitize'

const { PORT = 3000 } = process.env
const app = express()
// const csrf = require('csurf');

app.use(cookieParser())
// app.use(cors())
app.use(cors({ origin: ORIGIN_ALLOW, credentials: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.options('*', cors())

const csrf = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'your-super-secret-key-for-csrf-protection-min-32-chars',
  getSessionIdentifier: (req) => req.cookies.sessionId || req.headers['x-session-id'] as string || 'default-session',
  cookieName: 'csrf-token',
  cookieOptions: { 
    httpOnly: true, 
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  },
  size: 64,
});

app.get('/csrf-token', csrf.doubleCsrfProtection, (req: any, res: any) => {
    res.json({ csrfToken: csrf.generateCsrfToken(req, res) });
});

app.use((_req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src *; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3000 http://localhost:5173"
  );
  next();
})

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))
app.use(json())

app.use(sanitizeReq);

app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
