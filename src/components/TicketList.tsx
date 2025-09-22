// src/components/TicketList.tsx
'use client';
import { useMemo, useState } from 'react';
import type { Ticket } from '../types';

type Props = {
  tickets: Ticket[];
};

type SortOption = 'price-asc' | 'price-desc' | 'title-asc';

// Sort comparators map for O(1) dispatch
const sortComparators = {
  'price-asc': (a: Ticket, b: Ticket) => a.price - b.price,
  'price-desc': (a: Ticket, b: Ticket) => b.price - a.price,
  'title-asc': (a: Ticket, b: Ticket) => a.title.localeCompare(b.title),
} as const;

// Currency formatter
const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export default function TicketList({ tickets }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<SortOption>('price-asc');

  const filteredAndSortedTickets = useMemo(() => {
    // Compute search term once
    const normalizedSearchTerm = searchTerm.toLowerCase();
    
    // Filter by search term (case-insensitive contains on title)
    const filtered = normalizedSearchTerm
      ? tickets.filter(ticket =>
          ticket.title.toLowerCase().includes(normalizedSearchTerm)
        )
      : tickets;

    // Sort the filtered results (copy before sort for safety)
    return [...filtered].sort(sortComparators[sort]);
  }, [tickets, searchTerm, sort]);

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div>
          <label htmlFor="search-tickets" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
            Search tickets
          </label>
          <input
            id="search-tickets"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets..."
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        
        <div>
          <label htmlFor="sort-tickets" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
            Sort tickets
          </label>
          <select
            id="sort-tickets"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Title: A to Z</option>
          </select>
        </div>
      </div>

      {filteredAndSortedTickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredAndSortedTickets.map((ticket) => (
            <li
              key={ticket.id}
              style={{
                padding: '0.75rem',
                border: '1px solid #eee',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                backgroundColor: '#f9f9f9'
              }}
            >
              <strong>{ticket.title}</strong> — {formatPrice(ticket.price, ticket.currency)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}