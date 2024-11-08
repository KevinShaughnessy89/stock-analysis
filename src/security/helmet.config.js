// security.config.js

const developmentConfig = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",    // Allows inline scripts for development
                "'unsafe-eval'",      // Needed for some dev tools
                "http://localhost:*"  // For local development servers
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",    // Allows inline styles during development
                "https://fonts.googleapis.com"
            ],
            imgSrc: ["'self'", "data:", "http://localhost:*"],
            connectSrc: [
                "'self'",
                "http://localhost:*",  // Local API development
                "ws://localhost:*"     // WebSocket for hot reloading
            ],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'"],
        }
    },
    crossOriginEmbedderPolicy: false,    // More permissive in development
    crossOriginResourcePolicy: false,     // More permissive in development
    dnsPrefetchControl: false,           // Allow prefetching in development
    frameguard: false,                   // Allow framing in development
    hsts: false,                         // No HTTPS forcing in development
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true
};

const productionConfig = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "https://cdnjs.cloudflare.com",     // Trusted CDN
                "https://www.google-analytics.com"   // Analytics
            ],
            styleSrc: [
                "'self'",
                "https://fonts.googleapis.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https:",
                "https://www.google-analytics.com"
            ],
            connectSrc: [
                "'self'",
                "https://kevinshaughnessy.ca/api",       // Your API
                "https://www.google-analytics.com"
            ],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            upgradeInsecureRequests: true           // Force HTTPS
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginResourcePolicy: true,
    dnsPrefetchControl: { allow: false },
    frameguard: {
        action: 'deny'
    },
    hsts: {
        maxAge: 31536000,                // 1 year
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true
};

// Usage
const config = process.env.NODE_ENV === 'production' 
    ? productionConfig 
    : developmentConfig;

export default config;