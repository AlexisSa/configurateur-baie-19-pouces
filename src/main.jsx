import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { configurePricing } from "../xeilom-kit/utils/pricingConfig.js";
import { App } from "./App.jsx";
import "../xeilom-kit/styles/kit.css";
import "./styles/guide.css";

configurePricing({
  disclaimer: "Prix indicatifs HT. Le total TTC est calculé avec la TVA en vigueur.",
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
