import {
  formatAnswer,
  getStepOptions,
  resolveProduct,
} from "./rules.js";
import { getAccessories, groupAccessories } from "./accessories.js";

/** Illustrations des gammes — versions montées (photos catalogue Xeilom). */
const GAMME_IMAGES = {
  serveur:
    "https://www.xeilom.fr/Files/126457/Img/18/S6-600x1000_1.png",
  brassage:
    "https://www.xeilom.fr/Files/126457/Img/02/B6-600x600_1.png",
  "coffret-st":
    "https://www.xeilom.fr/Files/126457/Img/10/KX-ST126045MN_1.jpg",
  etanche:
    "https://www.xeilom.fr/Files/126457/Img/22/BAIEIP55-246060GS_1.jpg",
};

/** @type {import("../../core/types.js").GuideConfig} */
export const baieGuideConfig = {
  meta: {
    id: "baie",
    title: "Quelle baie choisir ?",
  },
  steps: [
    {
      id: "usage",
      recapLabel: "Gamme",
      question: "Quelle gamme vous intéresse ?",
      description:
        "Choisissez le type d'équipement adapté à votre usage. Chaque gamme répond à des besoins différents.",
      options: [
        {
          value: "serveur",
          label: "Baie serveur",
          imageUrl: GAMME_IMAGES.serveur,
          description:
            "Grande profondeur (800 à 1200 mm), charge élevée. Pour serveurs, onduleurs et équipements lourds en salle technique.",
        },
        {
          value: "brassage",
          label: "Baie de brassage",
          imageUrl: GAMME_IMAGES.brassage,
          description:
            "Profondeur réduite (600 à 800 mm). Optimisée pour switchs, panneaux de brassage et câblage réseau.",
        },
        {
          value: "coffret-st",
          label: "Coffret 19\"",
          imageUrl: GAMME_IMAGES["coffret-st"],
          description:
            "Armoire compacte, fixe ou sur pieds (6 à 27 U). Idéale pour local technique, bureau ou point de distribution.",
        },
        {
          value: "etanche",
          label: "Gamme étanche IP55",
          imageUrl: GAMME_IMAGES.etanche,
          description:
            "Protection poussière et projections d'eau. Baies et coffrets pour extérieur, industrie ou environnement sévère.",
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
  getAccessories,
  groupAccessories,
  formatAnswer,
  resolveProduct,
};
