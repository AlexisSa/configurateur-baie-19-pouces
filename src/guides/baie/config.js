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
  "etanche-baie":
    "https://www.xeilom.fr/Files/126457/Img/22/BAIEIP55-246060GS_1.jpg",
  "coffret-etanche":
    "https://www.xeilom.fr/Files/126457/Img/15/332-691707IP55-1_1.jpg",
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
          label: "Baie serveur 19 pouces",
          imageUrl: GAMME_IMAGES.serveur,
          description:
            "Baie 19 pouces — grande profondeur (800 à 1200 mm), charge élevée. Pour serveurs, onduleurs et équipements lourds.",
        },
        {
          value: "brassage",
          label: "Baie de brassage 19 pouces",
          imageUrl: GAMME_IMAGES.brassage,
          description:
            "Baie 19 pouces — profondeur réduite (600 à 800 mm). Optimisée pour switchs, panneaux de brassage et câblage réseau.",
        },
        {
          value: "coffret-st",
          label: "Coffret 19 pouces",
          imageUrl: GAMME_IMAGES["coffret-st"],
          description:
            "Coffret 19 pouces compact, fixe ou sur pieds (6 à 27 U). Idéal pour local technique, bureau ou point de distribution.",
        },
        {
          value: "etanche-baie",
          label: "Baie étanche IP55 19 pouces",
          imageUrl: GAMME_IMAGES["etanche-baie"],
          description:
            "Baie 19 pouces IP55 — protection poussière et projections d'eau. 24 à 42 U pour extérieur ou environnement sévère.",
        },
        {
          value: "coffret-etanche",
          label: "Coffret étanche IP55 19 pouces",
          imageUrl: GAMME_IMAGES["coffret-etanche"],
          description:
            "Coffret 19 pouces IP55 — 7 à 20 U, outdoor ou avec panneaux amovibles. Idéal en point de distribution extérieur.",
        },
      ],
    },
    {
      id: "height",
      recapLabel: "Hauteur",
      question: "Quelle hauteur utile (en U) ?",
      description: "Hauteurs disponibles dans notre catalogue pour cette gamme.",
      tileVariant: "text",
      options: [],
    },
    {
      id: "width",
      recapLabel: "Largeur",
      question: "Quelle largeur (mm) ?",
      description: "Largeur utile de la baie, en millimètres.",
      tileVariant: "text",
      options: [],
    },
    {
      id: "depth",
      recapLabel: "Profondeur",
      question: "Quelle profondeur (mm) ?",
      description: "Profondeur utile de la baie, en millimètres.",
      tileVariant: "text",
      options: [],
    },
    {
      id: "stand",
      recapLabel: "Pose",
      question: "Fixe ou sur pieds ?",
      description: "Choisissez le type de pose pour votre coffret.",
      tileVariant: "text",
      options: [],
    },
    {
      id: "mounting",
      recapLabel: "Montage",
      question: "En kit ou montée ?",
      description: "Version assemblée en usine ou à monter sur site.",
      tileVariant: "text",
      options: [],
    },
  ],
  getStepOptions,
  getAccessories,
  groupAccessories,
  formatAnswer,
  resolveProduct,
};
