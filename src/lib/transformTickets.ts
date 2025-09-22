import { RawTicket, Ticket } from '../types';

function normalizeTitle(title: unknown): string {
  if (typeof title !== 'string' || title.trim() === '') {
    return 'Untitled';
  }
  return title;
}

function normalizeCurrency(currency: unknown): 'USD' | 'EUR' | 'GBP' {
  if (currency === 'USD' || currency === 'EUR' || currency === 'GBP') {
    return currency;
  }
  return 'USD';
}

function normalizePrice(price_cents: unknown): number {
  if (typeof price_cents === 'number' && !isNaN(price_cents)) {
    return price_cents / 100;
  }
  return 0;
}

export function transformTickets(input: unknown): Ticket[] {
  if (!Array.isArray(input)) {
    return [];
  }
  
  return input
    .filter((item): item is RawTicket => 
      typeof item === 'object' && 
      item !== null && 
      'id' in item && 
      item.id !== null && 
      item.id !== undefined
    )
    .map((item): Ticket => ({
      id: String(item.id),
      title: normalizeTitle(item.title),
      price: normalizePrice(item.price_cents),
      currency: normalizeCurrency(item.currency),
    }));
}