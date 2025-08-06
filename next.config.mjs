/** @type {import('next').NextConfig} */

// Configuration CSP (Content Security Policy)
// CSP = Liste blanche de ce qui est autorisé dans votre app
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self' data:;
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Configuration des headers de sécurité HTTP
  async headers() {
    return [
      {
        // Applique ces headers à toutes les pages de votre app
        source: '/:path*',
        headers: [
          // 1. Protection contre le clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // 2. Empêche le navigateur de deviner le type de fichier
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // 3. Protection XSS pour les vieux navigateurs
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // 4. Contrôle les informations envoyées dans le Referer
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // 5. Désactive les APIs du navigateur non utilisées
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // 6. Content Security Policy - La protection principale
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  }
}

export default nextConfig
