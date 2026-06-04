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
