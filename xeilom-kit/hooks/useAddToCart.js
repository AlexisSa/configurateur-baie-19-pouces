import { useCallback, useEffect, useRef, useState } from "react";
import { getAllowedEmbedOrigins } from "../utils/embedOrigins.js";
import {
  ADD_TO_CART_MESSAGE_TYPE,
  ADD_TO_CART_RESULT_MESSAGE_TYPE,
  OXATIS_CART_BASE_URL,
} from "../utils/embedMessages.js";

const CART_TIMEOUT_MS = 3500;

function getPostMessageTargets() {
  if (import.meta.env.DEV) return ["*"];
  return getAllowedEmbedOrigins();
}

function isEmbeddedInParent() {
  try {
    return window.parent !== window;
  } catch {
    return true;
  }
}

/**
 * @param {number|{ productId: number, quantity?: number }[]} productIdOrItems
 * @param {number} [quantity]
 * @returns {{ productId: number, quantity: number }[]}
 */
function normalizeCartItems(productIdOrItems, quantity = 1) {
  if (Array.isArray(productIdOrItems)) {
    return productIdOrItems
      .map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity) || 1,
      }))
      .filter((item) => Number.isInteger(item.productId) && item.productId > 0);
  }

  const id = Number(productIdOrItems);
  if (!Number.isInteger(id) || id <= 0) return [];
  return [{ productId: id, quantity }];
}

function buildCartFallbackUrl(items) {
  const params = items
    .map((item) => {
      const qty = Number(item.quantity) || 1;
      return `ItmID=${item.productId}&itemQty=${qty}`;
    })
    .join("&");
  return `${OXATIS_CART_BASE_URL}?${params}`;
}

export function useAddToCart() {
  const [status, setStatus] = useState("idle");
  const pendingRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type !== ADD_TO_CART_RESULT_MESSAGE_TYPE) return;
      if (pendingRef.current == null) return;
      window.clearTimeout(pendingRef.current.timeoutId);
      pendingRef.current = null;
      setStatus(event.data.success ? "success" : "error");
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const addToCart = useCallback((productIdOrItems, quantity = 1) => {
    const items = normalizeCartItems(productIdOrItems, quantity);
    if (!items.length) return;

    setStatus("loading");
    const payload = {
      type: ADD_TO_CART_MESSAGE_TYPE,
      items,
      productId: items[0].productId,
      quantity: items[0].quantity,
    };

    if (isEmbeddedInParent()) {
      for (const origin of getPostMessageTargets()) {
        window.parent.postMessage(payload, origin);
      }
      const timeoutMs =
        items.length > 1 ? CART_TIMEOUT_MS * items.length : CART_TIMEOUT_MS;
      const timeoutId = window.setTimeout(() => {
        pendingRef.current = null;
        window.top.location.href = buildCartFallbackUrl(items);
        setStatus("fallback");
      }, timeoutMs);
      pendingRef.current = { items, timeoutId };
      return;
    }

    window.location.href = buildCartFallbackUrl(items);
    setStatus("fallback");
  }, []);

  return { status, addToCart };
}
