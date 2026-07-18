"use client";

import { useEffect } from "react";

type GoogleCustomerReviewsProduct = {
  gtin: string;
};

type GoogleCustomerReviewsOptInStyle =
  | "CENTER_DIALOG"
  | "BOTTOM_RIGHT_DIALOG"
  | "BOTTOM_LEFT_DIALOG"
  | "TOP_RIGHT_DIALOG"
  | "TOP_LEFT_DIALOG"
  | "BOTTOM_TRAY";

type GoogleCustomerReviewsPayload = {
  merchant_id: number;
  order_id: string;
  email: string;
  delivery_country: string;
  estimated_delivery_date: string;
  opt_in_style?: GoogleCustomerReviewsOptInStyle;
  products?: GoogleCustomerReviewsProduct[];
};

type GoogleCustomerReviewsOptInProps = {
  merchantId: number;
  orderId: string;
  email: string;
  deliveryCountry: string;
  estimatedDeliveryDate: string;
  language?: string;
  optInStyle?: GoogleCustomerReviewsOptInStyle;
  products?: GoogleCustomerReviewsProduct[];
};

declare global {
  interface Window {
    gapi?: {
      load: (moduleName: "surveyoptin", callback: () => void) => void;
      surveyoptin?: {
        render: (payload: GoogleCustomerReviewsPayload) => void;
      };
    };
    renderOptIn?: () => void;
    ___gcfg?: {
      lang?: string;
    };
    __googleCustomerReviewsRenderedOrders?: Set<string>;
  }
}

const googleCustomerReviewsScriptId = "google-customer-reviews-platform";

export function GoogleCustomerReviewsOptIn({
  merchantId,
  orderId,
  email,
  deliveryCountry,
  estimatedDeliveryDate,
  language = "es-419",
  optInStyle = "CENTER_DIALOG",
  products,
}: GoogleCustomerReviewsOptInProps) {
  useEffect(() => {
    if (!merchantId || !orderId || !email || !deliveryCountry || !estimatedDeliveryDate) return;

    window.___gcfg = {
      ...window.___gcfg,
      lang: language,
    };

    const payload: GoogleCustomerReviewsPayload = {
      merchant_id: merchantId,
      order_id: orderId,
      email,
      delivery_country: deliveryCountry,
      estimated_delivery_date: estimatedDeliveryDate,
      opt_in_style: optInStyle,
    };

    const validProducts = products?.filter((product) => product.gtin.trim().length > 0);
    if (validProducts?.length) payload.products = validProducts;

    window.renderOptIn = function renderOptIn() {
      if (!window.gapi?.load) return;

      window.gapi.load("surveyoptin", function renderGoogleSurveyOptIn() {
        if (!window.gapi?.surveyoptin?.render) return;

        const renderedOrders = window.__googleCustomerReviewsRenderedOrders ?? new Set<string>();
        window.__googleCustomerReviewsRenderedOrders = renderedOrders;

        if (renderedOrders.has(orderId)) return;
        renderedOrders.add(orderId);

        window.gapi.surveyoptin.render(payload);
      });
    };

    const existingScript = document.getElementById(googleCustomerReviewsScriptId);

    if (existingScript) {
      window.renderOptIn();
      return;
    }

    const script = document.createElement("script");
    script.id = googleCustomerReviewsScriptId;
    script.src = "https://apis.google.com/js/platform.js?onload=renderOptIn";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);
  }, [deliveryCountry, email, estimatedDeliveryDate, language, merchantId, optInStyle, orderId, products]);

  return null;
}
