/**
 * Registry
 */

import type { ComponentType } from "react";
import type { Block, HeroBlock, CardListBlock, CTABlock, SearchBarBlock, TicketListBlock } from "./types";
import Hero from "./components/Hero";
import CardList from "./components/CardList";
import CTA from "./components/CTA";
import SearchBar from "./components/SearchBar";
import TicketList from "./components/TicketList";

type ComponentMap = {
  Hero: ComponentType<HeroBlock["props"]>;
  CardList: ComponentType<CardListBlock["props"]>;
  CTA: ComponentType<CTABlock["props"]>;
  SearchBar: ComponentType<SearchBarBlock["props"]>;
  TicketList: ComponentType<TicketListBlock["props"]>;
};

export const registry: ComponentMap = {
  Hero,
  CardList,
  CTA,
  SearchBar,
  TicketList,
};

// Helper to narrow a Block to its props type for a given key
export function getComponentAndProps(block: Block) {
  const Comp = registry[block.type];
  return { Comp, props: block.props as any }; // safe due to discriminated union
}