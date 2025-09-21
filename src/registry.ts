/**
 * Registry
 */

import type { ComponentType } from "react";
import type { Block, HeroBlock, CardListBlock, CTABlock } from "./types";
import Hero from "./components/Hero";
import CardList from "./components/CardList";
import CTA from "./components/CTA";

type ComponentMap = {
  Hero: ComponentType<HeroBlock["props"]>;
  CardList: ComponentType<CardListBlock["props"]>;
  CTA: ComponentType<CTABlock["props"]>;
};

export const registry: ComponentMap = {
  Hero,
  CardList,
  CTA,
};

// Helper to narrow a Block to its props type for a given key
export function getComponentAndProps(block: Block) {
  const Comp = registry[block.type];
  return { Comp, props: block.props as any }; // safe due to discriminated union
}