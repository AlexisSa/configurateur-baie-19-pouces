import {
  formatAnswer,
  getStepOptions,
  resolveProduct,
} from "./rules.js";

/** @type {import("../../core/types.js").GuideConfig} */
export const baieGuideConfig = {
  meta: {
    id: "baie",
    eyebrow: "Xeilom · Baies 19 pouces",
    title: "Quelle baie choisir ?",
  },
  steps: [
    {
      id: "usage",
      recapLabel: "Gamme",
      question: "Quelle gamme vous intéresse ?",
      description:
        "Baies serveurs, baies de brassage, coffrets XT-ST ou gamme étanche IP55.",
      options: [
        {
          value: "serveur",
          label: "Baie serveur",
          description: "Datacenter, salle serveurs",
        },
        {
          value: "brassage",
          label: "Baie de brassage",
          description: "Brassage réseau 19\"",
        },
        {
          value: "coffret-st",
          label: "Coffret XT-ST",
          description: "Coffrets 19\" fixe ou sur pieds",
        },
        {
          value: "etanche",
          label: "Gamme étanche IP55",
          description: "Baies et coffrets outdoor",
        },
      ],
    },
    {
      id: "height",
      recapLabel: "Hauteur",
      question: "Quelle hauteur utile (en U) ?",
      description: "Hauteurs disponibles dans notre catalogue pour cette gamme.",
      options: [],
    },
    {
      id: "width",
      recapLabel: "Largeur",
      question: "Quelle largeur (mm) ?",
      description: "Largeur utile de la baie, en millimètres.",
      options: [],
    },
    {
      id: "depth",
      recapLabel: "Profondeur",
      question: "Quelle profondeur (mm) ?",
      description: "Profondeur utile de la baie, en millimètres.",
      options: [],
    },
    {
      id: "mounting",
      recapLabel: "Montage",
      question: "En kit ou montée ?",
      description: "Version assemblée en usine ou à monter sur site.",
      options: [],
    },
  ],
  getStepOptions,
  formatAnswer,
  resolveProduct,
};
