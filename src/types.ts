import { ReactNode } from "react";

/**
 * Types
 */

export type HeroBlock = {
  type: "Hero";
  props: { title: string; subtitle?: string };
};

export type CardListBlock = {
  type: "CardList";
  props: { items: Array<{ title: string; price?: number; href?: string }> };
};

export type CTABlock = {
  type: "CTA";
  props: { label: string; href: string; variant?: "primary" | "secondary" };
};

export type Block = HeroBlock | CardListBlock | CTABlock;

export type PageDoc = {
  pageTitle?: string;
  blocks: Block[];
};

export type BlockComponent<P> = (props: P) => ReactNode;