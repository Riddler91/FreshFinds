import {
  NorthCarolinaCottageFoodGuide,
  ncTocItems,
} from "./north-carolina";
import {
  SouthCarolinaCottageFoodGuide,
  scTocItems,
} from "./south-carolina";
import {
  TexasCottageFoodGuide,
  txTocItems,
} from "./texas";
import {
  VirginiaCottageFoodGuide,
  vaTocItems,
} from "./virginia";
import {
  ArkansasCottageFoodGuide,
  arTocItems,
} from "./arkansas";
import {
  KansasCottageFoodGuide,
  ksTocItems,
} from "./kansas";
import {
  FloridaCottageFoodGuide,
  flTocItems,
} from "./florida";
import {
  GeorgiaCottageFoodGuide,
  gaTocItems,
} from "./georgia";
import {
  AlabamaCottageFoodGuide,
  alTocItems,
} from "./alabama";
import {
  MississippiCottageFoodGuide,
  msTocItems,
} from "./mississippi";

export interface GuideData {
  Component: React.ComponentType;
  tocItems: { id: string; label: string }[];
  stateName: string;
}

export const GUIDE_REGISTRY: Record<string, GuideData> = {
  "sell-homemade-food-north-carolina-cottage-food-law-guide-2026": {
    Component: NorthCarolinaCottageFoodGuide,
    tocItems: ncTocItems,
    stateName: "North Carolina",
  },
  "sell-homemade-food-south-carolina-cottage-food-law-guide-2026": {
    Component: SouthCarolinaCottageFoodGuide,
    tocItems: scTocItems,
    stateName: "South Carolina",
  },
  "sell-homemade-food-texas-cottage-food-law-guide-2026": {
    Component: TexasCottageFoodGuide,
    tocItems: txTocItems,
    stateName: "Texas",
  },
  "sell-homemade-food-virginia-cottage-food-law-guide-2026": {
    Component: VirginiaCottageFoodGuide,
    tocItems: vaTocItems,
    stateName: "Virginia",
  },
  "sell-homemade-food-arkansas-cottage-food-law-guide-2026": {
    Component: ArkansasCottageFoodGuide,
    tocItems: arTocItems,
    stateName: "Arkansas",
  },
  "sell-homemade-food-kansas-cottage-food-law-guide-2026": {
    Component: KansasCottageFoodGuide,
    tocItems: ksTocItems,
    stateName: "Kansas",
  },
  "sell-homemade-food-florida-cottage-food-law-guide-2026": {
    Component: FloridaCottageFoodGuide,
    tocItems: flTocItems,
    stateName: "Florida",
  },
  "sell-homemade-food-georgia-cottage-food-law-guide-2026": {
    Component: GeorgiaCottageFoodGuide,
    tocItems: gaTocItems,
    stateName: "Georgia",
  },
  "sell-homemade-food-alabama-cottage-food-law-guide-2026": {
    Component: AlabamaCottageFoodGuide,
    tocItems: alTocItems,
    stateName: "Alabama",
  },
  "sell-homemade-food-mississippi-cottage-food-law-guide-2026": {
    Component: MississippiCottageFoodGuide,
    tocItems: msTocItems,
    stateName: "Mississippi",
  },
};

export function getGuideForSlug(slug: string): GuideData | undefined {
  return GUIDE_REGISTRY[slug];
}
