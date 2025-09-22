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

export type SearchBarBlock = {
  type: "SearchBar";
  props: { 
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
    syncWithUrl?: boolean;
    urlParam?: string;
    'aria-label'?: string;
    id?: string;
  };
};

export type TicketListBlock = {
  type: "TicketList";
  props: { tickets: Ticket[] };
};

export type Block = HeroBlock | CardListBlock | CTABlock | SearchBarBlock | TicketListBlock;

export type PageDoc = {
  pageTitle?: string;
  blocks: Block[];
};

export type BlockComponent<P> = (props: P) => ReactNode;

export type RawTicket = {
    id: string | number;
    title?: string | null;
    price_cents?: number | null;
    currency?: 'USD' | 'EUR' | 'GBP' | string | null;
  };
  
export type Ticket = {
id: string;             // normalized to string
title: string;          // fallback: "Untitled"
price: number;          // dollars, 2-decimal float (e.g., 12.34)
currency: 'USD' | 'EUR' | 'GBP'; // default 'USD' if unknown
};