import { useCallback, useEffect, useMemo, useState } from "react";
import { ToastContainer } from "../../xeilom-kit/components/ToastContainer.jsx";
import {
  useAddToCart,
  useEmbedContext,
  useEmbedResize,
  useToasts,
} from "../../xeilom-kit/hooks/index.js";
import { isEmbedMode } from "../../xeilom-kit/utils/embedMode.js";
import { buildGuidePricing } from "./guidePricing.js";
import { GuideProgress } from "./GuideProgress.jsx";
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
  const { pricingTierCode } = useEmbedContext();

  const { toasts, addToast, removeToast } = useToasts();
  const { status: cartStatus, addToCart } = useAddToCart();
  const guide = useGuideState(config);
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState([]);
  const [accessoryQuantities, setAccessoryQuantities] = useState({});

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

  const accessories = useMemo(() => {
    if (!guide.isComplete) return [];
    return config.getAccessories?.(guide.answers, resolvedProduct, catalog) ?? [];
  }, [catalog, config, guide.answers, guide.isComplete, resolvedProduct]);

  const pricing = useMemo(
    () =>
      buildGuidePricing({
        product: resolvedProduct,
        accessories,
        selectedAccessoryIds,
        accessoryQuantities,
        pricingTierCode,
      }),
    [
      accessoryQuantities,
      accessories,
      pricingTierCode,
      resolvedProduct,
      selectedAccessoryIds,
    ],
  );

  useEffect(() => {
    if (!guide.isComplete) {
      setSelectedAccessoryIds([]);
      setAccessoryQuantities({});
    }
  }, [guide.isComplete]);

  const toggleAccessory = useCallback(
    (id) => {
      setSelectedAccessoryIds((prev) => {
        if (prev.includes(id)) {
          setAccessoryQuantities((quantities) => {
            const next = { ...quantities };
            delete next[id];
            return next;
          });
          return prev.filter((item) => item !== id);
        }

        const accessory = accessories.find((item) => item.id === id);
        const group = accessory?.exclusiveGroup;
        const withoutGroup =
          group != null
            ? prev.filter((itemId) => {
                const other = accessories.find((item) => item.id === itemId);
                return other?.exclusiveGroup !== group;
              })
            : prev;

        setAccessoryQuantities((quantities) => ({ ...quantities, [id]: 1 }));
        return [...withoutGroup, id];
      });
    },
    [accessories],
  );

  const setAccessoryQuantity = useCallback(
    (id, quantity) => {
      const accessory = accessories.find((item) => item.id === id);
      const max = accessory?.maxQuantity ?? 1;
      const next = Math.min(max, Math.max(1, quantity));
      setAccessoryQuantities((prev) => ({ ...prev, [id]: next }));
    },
    [accessories],
  );

  const handleRestart = useCallback(() => {
    setSelectedAccessoryIds([]);
    setAccessoryQuantities({});
    guide.restart();
  }, [guide.restart]);

  useEffect(() => {
    if (cartStatus === "success") {
      const totalQty =
        1 +
        selectedAccessoryIds.reduce(
          (sum, id) => sum + (accessoryQuantities[id] ?? 1),
          0,
        );
      addToast(
        "success",
        "Ajouté au panier",
        selectedAccessoryIds.length
          ? `La baie et les accessoires (${totalQty} articles) ont été ajoutés à votre panier.`
          : "Le produit a été ajouté à votre panier.",
      );
    }
    if (cartStatus === "fallback") {
      addToast(
        "info",
        "Redirection panier",
        "Ouverture du panier Xeilom pour finaliser l'ajout.",
      );
    }
    if (cartStatus === "error") {
      addToast(
        "error",
        "Ajout impossible",
        "Le panier n'a pas répondu. Réessayez ou ajoutez les produits depuis le site.",
      );
    }
  }, [accessoryQuantities, addToast, cartStatus, selectedAccessoryIds]);

  const handleAddToCart = () => {
    if (!resolvedProduct) return;

    const items = [{ productId: resolvedProduct.productId, quantity: 1 }];
    for (const accessory of accessories) {
      if (selectedAccessoryIds.includes(accessory.id)) {
        items.push({
          productId: accessory.productId,
          quantity: accessoryQuantities[accessory.id] ?? 1,
        });
      }
    }

    addToCart(items);
  };

  const formatAnswer = (stepId, value) =>
    config.formatAnswer?.(stepId, value) ?? value;

  const totalSteps = config.steps.length;
  const stepNumber = Math.min(guide.stepIndex + 1, totalSteps);
  const progressPercent = guide.isComplete
    ? 100
    : Math.round(((guide.stepIndex + 1) / (totalSteps + 1)) * 100);

  const cartItemCount =
    1 +
    selectedAccessoryIds.reduce(
      (sum, id) => sum + (accessoryQuantities[id] ?? 1),
      0,
    );

  return (
    <>
      <main className={`guide-main${isEmbedMode() ? " guide-main--embed" : ""}`}>
        <GuideProgress
          title={config.meta?.title}
          stepNumber={stepNumber}
          totalSteps={totalSteps}
          percent={progressPercent}
          isComplete={guide.isComplete}
        />

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
                accessories={accessories}
                selectedAccessoryIds={selectedAccessoryIds}
                accessoryQuantities={accessoryQuantities}
                onToggleAccessory={toggleAccessory}
                onAccessoryQuantityChange={setAccessoryQuantity}
                groupAccessories={config.groupAccessories}
                cartStatus={cartStatus}
                cartItemCount={cartItemCount}
                pricing={pricing}
                pricingTierCode={pricingTierCode}
                onAddToCart={handleAddToCart}
                onRestart={handleRestart}
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
