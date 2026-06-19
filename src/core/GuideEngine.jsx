import { useEffect, useMemo } from "react";
import { Header } from "../../xeilom-kit/components/Header.jsx";
import { ToastContainer } from "../../xeilom-kit/components/ToastContainer.jsx";
import { useAddToCart, useEmbedResize, useToasts } from "../../xeilom-kit/hooks/index.js";
import { isEmbedMode } from "../../xeilom-kit/utils/embedMode.js";
import { GuideResult } from "./GuideResult.jsx";
import { GuideStepper } from "./GuideStepper.jsx";
import { StepQuestion } from "./StepQuestion.jsx";
import { useGuideState } from "./useGuideState.js";

/**
 * @param {{
 *   config: import("./types.js").GuideConfig,
 *   catalog: import("./types.js").CatalogProduct[],
 * }} props
 */
export function GuideEngine({ config, catalog }) {
  useEmbedResize();

  const { toasts, addToast, removeToast } = useToasts();
  const { status: cartStatus, addToCart } = useAddToCart();
  const guide = useGuideState(config);

  const currentStepOptions = useMemo(() => {
    if (!guide.currentStep || guide.isComplete) return [];
    return (
      config.getStepOptions?.(guide.currentStep.id, guide.answers, catalog) ??
      guide.currentStep.options
    );
  }, [catalog, config, guide.answers, guide.currentStep, guide.isComplete]);

  useEffect(() => {
    if (!guide.currentStep || guide.isComplete) return;

    if (currentStepOptions.length === 0) {
      guide.skipStep();
      return;
    }

    if (
      currentStepOptions.length === 1 &&
      !guide.answers[guide.currentStep.id]
    ) {
      guide.selectOption(currentStepOptions[0].value);
    }
  }, [
    currentStepOptions,
    guide.currentStep,
    guide.isComplete,
    guide.answers,
    guide.selectOption,
    guide.skipStep,
  ]);

  const resolvedProduct = useMemo(() => {
    if (!guide.isComplete) return null;
    return config.resolveProduct(guide.answers, catalog);
  }, [catalog, config, guide.answers, guide.isComplete]);

  useEffect(() => {
    if (cartStatus === "success") {
      addToast("success", "Ajouté au panier", "Le produit a été ajouté à votre panier.");
    }
    if (cartStatus === "fallback") {
      addToast(
        "info",
        "Redirection panier",
        "Ouverture du panier Xeilom pour finaliser l'ajout.",
      );
    }
  }, [addToast, cartStatus]);

  const handleAddToCart = () => {
    if (!resolvedProduct) return;
    addToCart(resolvedProduct.productId);
  };

  const formatAnswer = (stepId, value) =>
    config.formatAnswer?.(stepId, value) ?? value;

  return (
    <>
      <Header
        eyebrow={config.meta.eyebrow ?? "Xeilom · Guide de choix"}
        title={config.meta.title}
      />

      <main className={`guide-main${isEmbedMode() ? " guide-main--embed" : ""}`}>
        <div className="guide-layout">
          <GuideStepper
            steps={config.steps}
            answers={guide.answers}
            stepIndex={guide.stepIndex}
            isComplete={guide.isComplete}
            formatAnswer={formatAnswer}
            onGoToStep={guide.goToStep}
          />

          <div className="guide-content">
            {!guide.isComplete && guide.currentStep && (
              <StepQuestion
                step={{
                  ...guide.currentStep,
                  options: currentStepOptions,
                }}
                selectedValue={guide.answers[guide.currentStep.id]}
                onSelect={guide.selectOption}
                onBack={guide.goBack}
                canGoBack={guide.canGoBack}
              />
            )}

            {guide.isComplete && (
              <GuideResult
                product={resolvedProduct}
                cartStatus={cartStatus}
                onAddToCart={handleAddToCart}
                onRestart={guide.restart}
                onBack={() => guide.goToStep(config.steps.length - 1)}
              />
            )}
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
