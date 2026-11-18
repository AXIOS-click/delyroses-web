/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";
const imageCdnUrl = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || "https://cdn.delyroses-ec.com";
const normalizedImageCdnUrl = /^https?:\/\//i.test(imageCdnUrl) ? imageCdnUrl : `https://${imageCdnUrl}`;
const imageCdn = new URL(normalizedImageCdnUrl);
const imageCdnOrigin = imageCdn.origin;
const googleCustomerReviewsOrigins = ["https://apis.google.com", "https://www.google.com", "https://www.gstatic.com", "https://ssl.gstatic.com"];
const googleCustomerReviewsSources = googleCustomerReviewsOrigins.join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"} https://va.vercel-scripts.com ${googleCustomerReviewsSources}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com ${imageCdnOrigin} ${googleCustomerReviewsSources}`,
  `frame-src ${googleCustomerReviewsSources}`,
  isProduction ? "upgrade-insecure-requests" : "",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
];

const nextConfig = {
  poweredByHeader: false,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    remotePatterns: [
      {
        protocol: imageCdn.protocol.slice(0, -1),
        hostname: imageCdn.hostname,
        port: imageCdn.port,
        pathname: `${imageCdn.pathname.replace(/\/$/, "")}/**`,
        search: "",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/producto/ramo-romantico-mixto",
        destination: "/producto/ramo-floral-coreano-tulipanes-rosas",
        statusCode: 301,
      },
      {
        source: "/producto/ramo-rosas-rojas-clasico",
        destination: "/producto/arreglo-floral-romantico-rosas-rojas-orquideas",
        statusCode: 301,
      },
      {
        source: "/producto/arreglo-floral-elegante",
        destination: "/producto/arreglo-floral-elegante-rosas-inglesas-orquideas",
        statusCode: 301,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/merchant-center/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
          {
            key: "Content-Type",
            value: "text/tab-separated-values; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "private, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
