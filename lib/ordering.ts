import { canonicalPublicPath } from "./urls";

export const ORDER_PATH = "/order";
export const ORDER_DESTINATION =
  "https://order.degaso.de/1b33fef5-2777-434b-8960-03889fcfb1d7?role=1&minTime=20";

export function isOrderingHref(href: string): boolean {
  return canonicalPublicPath(href.split(/[?#]/, 1)[0]) === ORDER_PATH;
}
