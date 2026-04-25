declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export interface EventParams {
  [key: string]: string | number | undefined;
}

export function trackPageView(path: string, title: string) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
  });
}

export function trackEvent(action: string, params: EventParams = {}) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", action, {
    ...params,
  });
}

export const GA_EVENTS = {
  VIEW_PRODUCT: "view_product",
  ADD_TO_CART: "add_to_cart",
  REMOVE_FROM_CART: "remove_from_cart",
  BEGIN_CHECKOUT: "begin_checkout",
  PLACE_ORDER: "place_order",
} as const;