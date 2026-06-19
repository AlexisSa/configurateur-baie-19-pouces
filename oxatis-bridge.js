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
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
  ];

  var ADD_TO_CART = "XEILOM_ADD_TO_CART";
  var ADD_TO_CART_RESULT = "XEILOM_ADD_TO_CART_RESULT";
  var EMBED_RESIZE = "xeilom-resize";
  var EMBED_CONTEXT = "xeilom-context";
  var EMBED_REQUEST_CONTEXT = "xeilom-request-context";
  var MULTI_CART_DELAY_MS = 400;

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

  function normalizeCartItems(data) {
    if (Array.isArray(data.items) && data.items.length) {
      return data.items;
    }
    if (data.productId != null) {
      return [{ productId: data.productId, quantity: data.quantity || 1 }];
    }
    return [];
  }

  function addToCartOnOxatis(productId, quantity) {
    if (typeof window.AddToCart === "function") {
      window.AddToCart(productId);
      return "AddToCart";
    }
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
      "https://www.xeilom.fr/PBShoppingCart.asp?" + urlParams;
    return "redirect";
  }

  function addToCartViaAjax(productId, quantity) {
    var url =
      "/PBShoppingCart.asp?ajaxmode=1&cartRelatedProducts=1&ItmID=" + productId;
    var qty = parseInt(quantity, 10);
    if (Number.isFinite(qty) && qty > 1) {
      url += "&Qty=" + qty;
    }

    if (typeof fetch === "function") {
      return fetch(url, { credentials: "same-origin", method: "GET" })
        .then(function (response) {
          return response.ok;
        })
        .catch(function () {
          return false;
        });
    }

    return new Promise(function (resolve) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = function () {
        resolve(xhr.status >= 200 && xhr.status < 300);
      };
      xhr.onerror = function () {
        resolve(false);
      };
      xhr.send();
    });
  }

  function delay(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  /**
   * Le produit principal (items[0], la baie) déclenche le modal natif Oxatis.
   * Les accessoires sont ajoutés silencieusement en AJAX AVANT, puis le modal
   * natif est ouvert en dernier pour qu'il reflète le panier complet.
   */
  function addItemsToCart(items) {
    if (!items.length) {
      return Promise.resolve({ success: false, methods: [] });
    }

    var mainItem = items[0];
    var accessories = items.slice(1);

    if (!accessories.length) {
      var singleId = parseProductId(mainItem.productId);
      if (singleId == null) {
        return Promise.resolve({ success: false, methods: [] });
      }
      return Promise.resolve({
        success: true,
        methods: [addToCartOnOxatis(singleId, mainItem.quantity || 1)],
      });
    }

    var methods = [];
    var chain = Promise.resolve();

    accessories.forEach(function (item) {
      chain = chain.then(function () {
        var productId = parseProductId(item.productId);
        if (productId == null) return null;
        return addToCartViaAjax(productId, item.quantity || 1)
          .then(function (ajaxOk) {
            methods.push((ajaxOk ? "ajax:" : "ajax-fail:") + productId);
          })
          .then(function () {
            return delay(MULTI_CART_DELAY_MS);
          });
      });
    });

    return chain.then(function () {
      var mainId = parseProductId(mainItem.productId);
      if (mainId == null) {
        return { success: methods.length > 0, methods: methods };
      }
      methods.push(addToCartOnOxatis(mainId, mainItem.quantity || 1));
      return { success: true, methods: methods };
    });
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

    var items = normalizeCartItems(data);

    addItemsToCart(items).then(function (result) {
      if (!result.methods.length) {
        replyToIframe(event.source, event.origin, {
          type: ADD_TO_CART_RESULT,
          success: false,
          productId: data.productId,
        });
        return;
      }

      replyToIframe(event.source, event.origin, {
        type: ADD_TO_CART_RESULT,
        success: result.success,
        productId: parseProductId(items[0].productId),
        itemCount: items.length,
        method: result.methods.join("+"),
      });
    });
  });
})();
