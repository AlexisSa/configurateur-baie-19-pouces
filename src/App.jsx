import { Navigate, Route, Routes } from "react-router-dom";
import { GuideEngine } from "./core/GuideEngine.jsx";
import { baieGuideConfig, catalog } from "./guides/baie/index.js";

export function App() {
  return (
    <div className="app app--embed">
      <Routes>
        <Route
          path="/baie"
          element={<GuideEngine config={baieGuideConfig} catalog={catalog} />}
        />
        <Route path="/" element={<Navigate to="/baie" replace />} />
        <Route path="*" element={<Navigate to="/baie" replace />} />
      </Routes>
    </div>
  );
}
