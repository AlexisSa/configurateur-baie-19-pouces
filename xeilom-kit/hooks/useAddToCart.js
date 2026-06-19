import { useCallback, useEffect, useRef, useState } from "react";
import { getAllowedEmbedOrigins } from "../utils/embedOrigins.js";
import {
  ADD_TO_CART_MESSAGE_TYPE,
  ADD_TO_CART_RESULT_MESSAGE_TYPE,
  OXATIS_CART_BASE_URL,
} from "../utils/embedMessages.js";

const CART_TIMEOUT_MS = 2000;

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

export function useAddToCart() {
  const [status, setStatus] = useState("idle");
  const pendingRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type !== ADD_TO_CART_RESULT_MESSAGE_TYPE) return;
      if (pendingRef.current == null) return;
      window.clearTimeout(pendingRef.current.timeoutId);
      pendingRef.current = null;
      setStatus(event.data.success ? "success" : "fallback");
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const addToCart = useCallback((productId, quantity = 1) => {
    const id = Number(productId);
    if (!Number.isInteger(id) || id <= 0) return;
    setStatus("loading");
    const payload = { type: ADD_TO_CART_MESSAGE_TYPE, productId: id, quantity };

    if (isEmbeddedInParent()) {
      for (const origin of getPostMessageTargets()) {
        window.parent.postMessage(payload, origin);
      }
      const timeoutId = window.setTimeout(() => {
        pendingRef.current = null;
        window.top.location.href = `${OXATIS_CART_BASE_URL}?ItmID=${id}`;
        setStatus("fallback");
      }, CART_TIMEOUT_MS);
      pendingRef.current = { productId: id, timeoutId };
      return;
    }

    window.location.href = `${OXATIS_CART_BASE_URL}?ItmID=${id}`;
    setStatus("fallback");
  }, []);

  return { status, addToCart };
}
