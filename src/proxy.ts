import { NextResponse, type NextRequest } from "next/server";

const merchantId = process.env.NEXT_PUBLIC_GOOGLE_CUSTOMER_REVIEWS_MERCHANT_ID || "5827107494";
const fallbackFeedToken = `dr-merchant-feed-${merchantId}`;
const enforceGoogleUserAgent = process.env.MERCHANT_CENTER_ENFORCE_GOOGLE_USER_AGENT === "true";

function sanitizeFeedToken(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function getFeedToken() {
  return sanitizeFeedToken(process.env.MERCHANT_CENTER_FEED_TOKEN || fallbackFeedToken);
}

function isGoogleMerchantRequest(request: NextRequest) {
  if (!enforceGoogleUserAgent) return true;

  const userAgent = request.headers.get("user-agent") || "";

  return /(?:Google|Googlebot|GoogleOther|AdsBot-Google|APIs-Google|Feedfetcher-Google|Google-InspectionTool|Storebot-Google)/i.test(userAgent);
}

function hiddenResponse() {
  return new NextResponse(null, {
    status: 404,
    headers: {
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "Cache-Control": "no-store",
    },
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const expectedPath = `/merchant-center/${getFeedToken()}/products.txt`;

  if (pathname !== expectedPath || !isGoogleMerchantRequest(request)) {
    return hiddenResponse();
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "private, max-age=0, must-revalidate");
  return response;
}

export const config = {
  matcher: "/merchant-center/:path*",
};
