import { describe, expect, it } from "vitest";
import catalog from "../src/guides/baie/catalog.json";
import { baieGuideConfig } from "../src/guides/baie/config.js";
import {
  getVisibleGuideSteps,
  isStepVisibleInGuide,
} from "../src/core/guideStepVisibility.js";

const { isStepVisible } = baieGuideConfig;

describe("isStepVisibleInGuide", () => {
  it("masque Pose et Modèle hors des gammes concernées", () => {
    expect(
      isStepVisibleInGuide(
        { id: "stand", question: "", options: [] },
        { usage: "serveur" },
        catalog,
        isStepVisible,
      ),
    ).toBe(false);
    expect(
      isStepVisibleInGuide(
        { id: "coffretVariant", question: "", options: [] },
        { usage: "serveur" },
        catalog,
        isStepVisible,
      ),
    ).toBe(false);
  });

  it("affiche Pose et Modèle dès la sélection de la gamme", () => {
    expect(
      isStepVisibleInGuide(
        { id: "stand", question: "", options: [] },
        { usage: "coffret-st" },
        catalog,
        isStepVisible,
      ),
    ).toBe(true);
    expect(
      isStepVisibleInGuide(
        { id: "coffretVariant", question: "", options: [] },
        { usage: "coffret-etanche" },
        catalog,
        isStepVisible,
      ),
    ).toBe(true);
  });
});

describe("getVisibleGuideSteps", () => {
  it("inclut Pose dès le choix coffret 19 pouces", () => {
    const steps = getVisibleGuideSteps(
      baieGuideConfig.steps,
      { usage: "coffret-st" },
      catalog,
      isStepVisible,
    );

    expect(steps.map(({ step }) => step.id)).toContain("stand");
    expect(steps.map(({ step }) => step.id)).not.toContain("coffretVariant");
  });

  it("inclut Modèle dès le choix coffret étanche", () => {
    const steps = getVisibleGuideSteps(
      baieGuideConfig.steps,
      { usage: "coffret-etanche" },
      catalog,
      isStepVisible,
    );

    expect(steps.map(({ step }) => step.id)).toContain("coffretVariant");
    expect(steps.map(({ step }) => step.id)).not.toContain("stand");
  });

  it("n'inclut ni Pose ni Modèle pour une baie serveur", () => {
    const steps = getVisibleGuideSteps(
      baieGuideConfig.steps,
      { usage: "serveur" },
      catalog,
      isStepVisible,
    );

    expect(steps.map(({ step }) => step.id)).not.toContain("stand");
    expect(steps.map(({ step }) => step.id)).not.toContain("coffretVariant");
  });
});
