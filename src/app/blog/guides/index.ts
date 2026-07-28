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
};

export function getGuideForSlug(slug: string): GuideData | undefined {
  return GUIDE_REGISTRY[slug];
}
