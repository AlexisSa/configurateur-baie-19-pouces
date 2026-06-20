import { describe, expect, it } from "vitest";
import catalog from "../src/guides/baie/catalog.json";
import { baieGuideConfig } from "../src/guides/baie/config.js";
import {
  findLastReachableStepIndex,
  findNextStepIndex,
  findPreviousStepIndex,
} from "../src/core/guideNavigation.js";

const { getStepOptions, steps } = baieGuideConfig;

describe("findPreviousStepIndex", () => {
  it("permet de revenir à la gamme depuis la hauteur", () => {
    expect(
      findPreviousStepIndex(
        steps.findIndex((step) => step.id === "height"),
        steps,
        { usage: "serveur" },
        catalog,
        getStepOptions,
      ),
    ).toBe(steps.findIndex((step) => step.id === "usage"));
  });

  it("ignore les étapes sans option pour une baie serveur", () => {
    const answers = {
      usage: "serveur",
      height: "42",
      width: "800",
      depth: "1000",
      mounting: "kit",
    };
    const mountingIndex = steps.findIndex((step) => step.id === "mounting");

    expect(
      findPreviousStepIndex(
        mountingIndex,
        steps,
        answers,
        catalog,
        getStepOptions,
      ),
    ).toBe(steps.findIndex((step) => step.id === "depth"));
  });
});

describe("findLastReachableStepIndex", () => {
  it("renvoie la dernière étape réellement posée pour un coffret étanche", () => {
    const answers = {
      usage: "coffret-etanche",
      height: "12",
      width: "600",
      depth: "600",
      coffretVariant: "outdoor",
    };

    expect(
      findLastReachableStepIndex(steps, answers, catalog, getStepOptions),
    ).toBe(steps.findIndex((step) => step.id === "coffretVariant"));
  });
});

describe("findNextStepIndex", () => {
  it("saute modèle et montage quand ils sont vides", () => {
    const answers = {
      usage: "serveur",
      height: "42",
      width: "800",
      depth: "1000",
    };
    const depthIndex = steps.findIndex((step) => step.id === "depth");

    expect(
      findNextStepIndex(depthIndex, steps, answers, catalog, getStepOptions),
    ).toBe(steps.findIndex((step) => step.id === "mounting"));
  });
});
