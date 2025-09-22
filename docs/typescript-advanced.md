# TypeScript Advanced Concepts

## TypeScript 5.9 Key Features

### 1. **Strict Type Checking**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 2. **Modern Module Resolution**
```typescript
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## Our Implementation

### Type-Safe Component Registry
```typescript
// src/types.ts
type Block = HeroBlock | CardListBlock | CTABlock;

type HeroBlock = {
  type: "Hero";
  props: {
    title: string;
    subtitle?: string;
  };
};

type CardListBlock = {
  type: "CardList";
  props: {
    items: Array<{
      title: string;
      price?: number;
      href?: string;
    }>;
  };
};
```

### Data Transformation Types
```typescript
// src/types.ts
type RawTicket = {
  id: unknown;
  title: unknown;
  price_cents: unknown;
  currency: unknown;
};

type Ticket = {
  id: string;
  title: string;
  price: number;
  currency: 'USD' | 'EUR' | 'GBP';
};
```

### Discriminated Unions
```typescript
// TypeScript knows which props belong to which component
function getComponentAndProps(block: Block) {
  const Comp = registry[block.type]; // Type-safe lookup
  return { Comp, props: block.props }; // Props are correctly typed
}
```

## Advanced TypeScript Patterns

### 1. **Generic Types**
```typescript
// Generic component registry
type ComponentRegistry<T extends Record<string, any>> = {
  [K in keyof T]: ComponentType<T[K]>;
};

// Usage
type MyComponents = {
  Hero: { title: string };
  CardList: { items: any[] };
};

const registry: ComponentRegistry<MyComponents> = {
  Hero,
  CardList,
};
```

### 2. **Conditional Types**
```typescript
// Extract component props from registry
type ComponentProps<T> = T extends ComponentType<infer P> ? P : never;

// Usage
type HeroProps = ComponentProps<typeof Hero>; // { title: string; subtitle?: string; }
```

### 3. **Template Literal Types**
```typescript
// Create type-safe event names
type EventName = `on${Capitalize<string>}`;
type EventHandler<T> = T extends `on${infer U}` ? (event: Event) => void : never;

// Usage
type ClickHandler = EventHandler<'onClick'>; // (event: Event) => void
```

### 4. **Mapped Types**
```typescript
// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### 5. **Data Transformation Patterns**
```typescript
// Type-safe data transformation with validation
function transformTickets(input: unknown): Ticket[] {
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

// Helper functions with type guards
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
```

### 6. **Utility Types**
```typescript
// Pick specific properties
type HeroTitle = Pick<HeroBlock['props'], 'title'>; // { title: string }

// Omit specific properties
type HeroWithoutTitle = Omit<HeroBlock['props'], 'title'>; // { subtitle?: string }

// Extract specific types
type StringProps = Extract<HeroBlock['props'][keyof HeroBlock['props']], string>;

// Exclude specific types
type NonStringProps = Exclude<HeroBlock['props'][keyof HeroBlock['props']], string>;
```

## Interview Questions & Answers

### Q: "What's the difference between `interface` and `type`?"
**A:**
- **Interface**: Can be extended, merged, and implemented
- **Type**: More flexible, can represent unions, primitives, and computed types
- **Use interfaces for object shapes**, types for everything else

```typescript
// Interface - can be extended
interface BaseComponent {
  id: string;
}

interface HeroComponent extends BaseComponent {
  title: string;
}

// Type - more flexible
type ComponentType = 'Hero' | 'CardList' | 'CTA';
type ComponentProps<T> = T extends 'Hero' ? { title: string } : never;
```

### Q: "How do you handle type safety with external APIs?"
**A:**
```typescript
// Runtime validation with type guards
function isApiResponse(data: any): data is ApiResponse {
  return data && 
         typeof data.id === 'string' && 
         Array.isArray(data.items);
}

// Use with API calls
async function fetchData(): Promise<ApiResponse> {
  const response = await fetch('/api/data');
  const data = await response.json();
  
  if (!isApiResponse(data)) {
    throw new Error('Invalid API response');
  }
  
  return data;
}
```

### Q: "How do you implement type-safe event handling?"
**A:**
```typescript
// Type-safe event system
type EventMap = {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string };
  'product:view': { productId: string; category: string };
};

class EventEmitter {
  private listeners: { [K in keyof EventMap]?: Array<(data: EventMap[K]) => void> } = {};

  on<K extends keyof EventMap>(event: K, listener: (data: EventMap[K]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }
}
```

### Q: "How do you handle generic constraints?"
**A:**
```typescript
// Constrain generics to specific types
interface Component<T extends Record<string, any>> {
  props: T;
  render(): React.ReactNode;
}

// Constrain to object types
function mergeObjects<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b };
}

// Constrain to function types
function callWithCallback<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  return fn(...args);
}
```

## Advanced Patterns

### 1. **Branded Types**
```typescript
// Create distinct types for the same primitive
type UserId = string & { __brand: 'UserId' };
type ProductId = string & { __brand: 'ProductId' };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createProductId(id: string): ProductId {
  return id as ProductId;
}

// Prevents mixing up IDs
function getUser(id: UserId) { /* ... */ }
function getProduct(id: ProductId) { /* ... */ }

// This would cause a TypeScript error:
// getUser(createProductId('123')); // Error!
```

### 2. **Recursive Types**
```typescript
// Tree structure
type TreeNode<T> = {
  value: T;
  children: TreeNode<T>[];
};

// JSON-like structure
type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };
```

### 3. **Template Literal Types**
```typescript
// API endpoint types
type ApiEndpoint = `/api/${string}`;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ApiCall<T extends ApiEndpoint, M extends HttpMethod> = {
  endpoint: T;
  method: M;
  body: M extends 'GET' ? never : any;
};

// Usage
type GetUsers = ApiCall<'/api/users', 'GET'>;
type CreateUser = ApiCall<'/api/users', 'POST'>;
```

## Performance Considerations

### 1. **Type-Only Imports**
```typescript
// Import only types (removed at runtime)
import type { ComponentType } from 'react';
import type { Block } from './types';

// Regular import (included at runtime)
import { renderBlocks } from './renderBlocks';
```

### 2. **Avoid Complex Types in Hot Paths**
```typescript
// Good - simple types
type SimpleProps = {
  title: string;
  count: number;
};

// Avoid - complex types in frequently called functions
type ComplexProps = {
  data: Array<{
    items: Array<{
      nested: {
        deep: {
          value: string;
        };
      };
    }>;
  }>;
};
```

## Best Practices

1. **Use Strict Mode**: Enable all strict type checking options
2. **Prefer Types Over Any**: Use `unknown` instead of `any`
3. **Use Type Guards**: Validate data at runtime
4. **Leverage Utility Types**: Use built-in utility types
5. **Document Complex Types**: Add JSDoc comments for complex types
6. **Use Branded Types**: For distinct primitive types

## Interactive Component Patterns

### 1. **State Management with TypeScript**
```typescript
// src/components/TicketList.tsx
type SortOption = 'price-asc' | 'price-desc' | 'title-asc';

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<SortOption>('price-asc');

  const filteredAndSortedTickets = useMemo(() => {
    const filtered = tickets.filter(ticket =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'title-asc': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });
  }, [tickets, searchTerm, sort]);
}
```

### 2. **Event Handler Typing**
```typescript
// Properly typed event handlers
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
};

const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSort(e.target.value as SortOption);
};
```

### 3. **Accessibility with TypeScript**
```typescript
// Type-safe accessibility props
type AccessibilityProps = {
  'aria-label': string;
  'aria-describedby'?: string;
  role?: string;
};

const searchInput = (
  <input
    type="text"
    value={searchTerm}
    onChange={handleSearchChange}
    aria-label="Search tickets"
    placeholder="Search tickets..."
  />
);
```

## Common Pitfalls

1. **Over-typing**: Don't create types for everything
2. **Any Usage**: Avoid `any` - use `unknown` instead
3. **Complex Generics**: Keep generics simple and readable
4. **Runtime vs Compile-time**: Remember TypeScript types are erased at runtime
5. **Type Assertions**: Use sparingly and with caution
6. **Event Handler Types**: Always type React event handlers properly
7. **State Type Inference**: Let TypeScript infer simple state types when possible
