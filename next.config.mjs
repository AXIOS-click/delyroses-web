/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";
const imageCdnUrl = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || "https://cdn.delyroses-ec.com";
const normalizedImageCdnUrl = /^https?:\/\//i.test(imageCdnUrl) ? imageCdnUrl : `https://${imageCdnUrl}`;
const imageCdn = new URL(normalizedImageCdnUrl);
const imageCdnHostname = imageCdn.hostname;
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
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: imageCdnHostname,
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
