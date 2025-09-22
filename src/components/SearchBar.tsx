// src/components/SearchBar.tsx
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  syncWithUrl?: boolean;
  urlParam?: string;
  'aria-label'?: string;
  id?: string;
};

// Custom hook for debounced value
function useDebounce<T>(value: T, delay: number): { value: T; hasChanged: boolean } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setHasChanged(true);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, isFirstRender]);


  return { value: debouncedValue, hasChanged };
}

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  syncWithUrl = false,
  urlParam = 'search',
  'aria-label': ariaLabel = 'Search input',
  id = 'search-input'
}: Props) {
  const [inputValue, setInputValue] = useState(value);
  const [isClient, setIsClient] = useState(false);
  const isFirstRender = useRef(true);
  const debounced = useDebounce(inputValue, debounceMs);

  // Handle SSR - only run client-side code after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Initialize from URL on mount if syncWithUrl is enabled
  useEffect(() => {
    if (isClient && syncWithUrl && typeof window !== 'undefined' && window.location) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlSearchValue = urlParams.get(urlParam) || '';
        if (urlSearchValue && urlSearchValue !== inputValue) {
          setInputValue(urlSearchValue);
        }
      } catch {
        // Silently fail in test environment
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, syncWithUrl, urlParam]); // Only run on mount and when sync settings change

  // Notify parent of debounced value changes (skip initial render)
  useEffect(() => {
    if (onChange && !isFirstRender.current && debounced.hasChanged) {
      onChange(debounced.value);
    }
    isFirstRender.current = false;
  }, [debounced, onChange]);

  // Update URL when debounced value changes
  useEffect(() => {
    if (isClient && syncWithUrl && typeof window !== 'undefined' && window.location) {
      try {
        const url = new URL(window.location.href);
        if (debounced.value.trim()) {
          url.searchParams.set(urlParam, debounced.value);
        } else {
          url.searchParams.delete(urlParam);
        }
        
        // Update URL without page reload
        window.history.replaceState({}, '', url.toString());
      } catch {
        // Silently fail in test environment
      }
    }
  }, [isClient, debounced, syncWithUrl, urlParam]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  }, []);

  const handleClear = useCallback(() => {
    setInputValue('');
  }, []);

  return (
    <div style={{ position: 'relative', display: 'block', width: '100%' }}>
      <label 
        htmlFor={id}
        style={{ 
          display: 'block', 
          marginBottom: '0.25rem', 
          fontSize: '0.875rem', 
          fontWeight: '500',
          color: '#374151'
        }}
      >
        {ariaLabel}
      </label>
      
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-describedby={inputValue ? `${id}-clear` : undefined}
          style={{
            width: '100%',
            padding: '0.75rem 2.5rem 0.75rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '1rem',
            backgroundColor: '#ffffff',
            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        />
        
        {inputValue && (
          <button
            id={`${id}-clear`}
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              color: '#6b7280',
              fontSize: '1.25rem',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#374151';
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        )}
      </div>
      
      {debounceMs > 0 && (
        <div 
          style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280', 
            marginTop: '0.25rem',
            minHeight: '1rem'
          }}
        >
          {inputValue !== debounced.value && (
            <span>Searching...</span>
          )}
        </div>
      )}
    </div>
  );
}