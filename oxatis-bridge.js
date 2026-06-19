/**
 * Script pont Oxatis — coller en fin de page sur xeilom.fr
 * Design → Code personnalisé → Fin de page (JavaScript)
 *
 * ALLOWED_ORIGINS = origines de l'iframe (app guide), pas xeilom.fr.
 */
(function () {
  var ALLOWED_ORIGINS = [
    "https://configurateur-baie-19-pouces.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ];

  var ADD_TO_CART = "XEILOM_ADD_TO_CART";
  var ADD_TO_CART_RESULT = "XEILOM_ADD_TO_CART_RESULT";
  var EMBED_RESIZE = "xeilom-resize";
  var EMBED_CONTEXT = "xeilom-context";
  var EMBED_REQUEST_CONTEXT = "xeilom-request-context";

  function isAllowedOrigin(origin) {
    return ALLOWED_ORIGINS.indexOf(origin) !== -1;
  }

  function parseProductId(value) {
    var id = parseInt(value, 10);
    if (!Number.isFinite(id) || id <= 0) return null;
    return id;
  }

  function buildCartUrlParams(productId, quantity) {
    var params = "ItmID=" + productId;
    var qty = parseInt(quantity, 10);
    if (Number.isFinite(qty) && qty > 1) {
      params += "&Qty=" + qty;
    }
    return params;
  }

  function addToCartOnOxatis(productId, quantity) {
    if (typeof window.AddToCart === "function") {
      window.AddToCart(productId);
      return "AddToCart";
    }
    // Pages contenu (PBCPPlayer) : pas de AddToCart/PostFormData, mais OxAddToCart oui.
    var urlParams = buildCartUrlParams(productId, quantity);
    if (typeof window.OxAddToCart === "function") {
      window.OxAddToCart(productId, urlParams);
      return "OxAddToCart";
    }
    if (window.oxCart && typeof window.oxCart.oxAddToCart === "function") {
      window.oxCart.oxAddToCart(productId, urlParams);
      return "oxCart.oxAddToCart";
    }
    window.location.href =
      "https://www.xeilom.fr/PBShoppingCart.asp?ItmID=" + productId;
    return "redirect";
  }

  function replyToIframe(source, origin, payload) {
    if (source && typeof source.postMessage === "function") {
      source.postMessage(payload, origin);
    }
  }

  function sendPricingContext(source, origin) {
    var catid = null;
    try {
      if (window.oxInfos && window.oxInfos.oxUser && window.oxInfos.oxUser.catid) {
        catid = String(window.oxInfos.oxUser.catid[0]);
      }
    } catch (e) {}
    if (!catid) return;
    replyToIframe(source, origin, { type: EMBED_CONTEXT, categoryId: catid });
  }

  window.addEventListener("message", function (event) {
    if (!isAllowedOrigin(event.origin)) return;
    var data = event.data;
    if (!data || typeof data.type !== "string") return;

    if (data.type === EMBED_REQUEST_CONTEXT) {
      sendPricingContext(event.source, event.origin);
      return;
    }

    if (data.type === EMBED_RESIZE && typeof data.height === "number") {
      var frames = document.getElementsByTagName("iframe");
      for (var i = 0; i < frames.length; i++) {
        if (frames[i].contentWindow === event.source) {
          frames[i].style.height = Math.max(data.height, 320) + "px";
        }
      }
      return;
    }

    if (data.type !== ADD_TO_CART) return;

    var productId = parseProductId(data.productId);
    if (productId == null) {
      replyToIframe(event.source, event.origin, {
        type: ADD_TO_CART_RESULT,
        success: false,
        productId: data.productId,
      });
      return;
    }

    var method = addToCartOnOxatis(productId, data.quantity);
    replyToIframe(event.source, event.origin, {
      type: ADD_TO_CART_RESULT,
      success: true,
      productId: productId,
      method: method,
    });
  });
})();
