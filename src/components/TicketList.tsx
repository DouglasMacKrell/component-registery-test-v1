// src/components/TicketList.tsx
'use client';
import { useMemo, useState, useCallback } from 'react';
import type { Ticket } from '../types';
import SearchBar from './SearchBar';

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

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return (
    <div>
      {/* MAJOR FIX: Controls now properly separated and responsive */}
      <div style={{ 
        marginBottom: '2rem',
        display: 'block'
      }}>
        {/* Search Section */}
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '2px solid #0ea5e9'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#0369a1' }}>🔍 Search Events - UPDATED {new Date().toLocaleTimeString()}</h3>
          <SearchBar
            onChange={handleSearchChange}
            placeholder="Search tickets by title..."
            debounceMs={300}
            syncWithUrl={true}
            urlParam="search"
            aria-label="Search tickets"
            id="ticket-search"
          />
        </div>
        
        {/* Sort Section */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          border: '2px solid #f59e0b'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#92400e' }}>📊 Sort Options</h3>
          <label 
            htmlFor="sort-tickets"
            style={{ 
              display: 'block', 
              marginBottom: '0.25rem', 
              fontSize: '0.875rem', 
              fontWeight: '500',
              color: '#92400e'
            }}
          >
            Sort tickets
          </label>
          <select
            id="sort-tickets"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            style={{ 
              width: '100%',
              maxWidth: '300px',
              padding: '0.75rem', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px',
              fontSize: '1rem',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Title: A to Z</option>
          </select>
        </div>
      </div>

      {filteredAndSortedTickets.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ margin: 0, fontSize: '1rem' }}>
            {searchTerm ? `No tickets found matching "${searchTerm}"` : 'No tickets available'}
          </p>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filteredAndSortedTickets.map((ticket) => (
            <li
              key={ticket.id}
              style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '0.75rem',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                transition: 'box-shadow 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.125rem', color: '#111827' }}>{ticket.title}</strong>
                <span style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: '#059669',
                  backgroundColor: '#ecfdf5',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #d1fae5'
                }}>
                  {formatPrice(ticket.price, ticket.currency)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}