import sanitizeHtml from 'sanitize-html'

export const clean = (dirty: string): string => {
    if (!dirty) return ''

    return sanitizeHtml(dirty, {
        allowedTags: [
            'b',
            'i',
            'strong',
            'a',
            'p',
            'br',
            'ul',
            'ol',
            'li',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
        ],
        allowedAttributes: {
            a: ['href'],
            img: [
                'src',
                'srcset',
                'alt',
                'title',
                'width',
                'height',
                'loading',
            ],
        },
        allowedSchemes: ['http', 'https'],
        allowedSchemesByTag: {},
        allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
        allowProtocolRelative: false,
    })
}

// санитизируем все строки
export const sanitizeReq = (req: any, _res: any, next: any) => {
    if (req.body) {
        Object.keys(req.body).forEach((key) => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = clean(req.body[key])
            }
        })
    }
    next()
}

export const sanitizeObj = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizeObj)
    }

    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith('$')) {
            continue
        }
        sanitized[key] = sanitizeObj(value)
    }
    return sanitized
}

export const hasOperators = (obj: any): boolean => {
    const str = JSON.stringify(obj)
    return /\$expr|\$function|\$ne|\$gt|\$lt|\$regex|\$where/i.test(str)
}
