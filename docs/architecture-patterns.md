# Architecture & Design Patterns

## System Architecture Overview

Our component registry system follows several key architectural patterns:

### 1. **Registry Pattern**
```typescript
// Centralized component management
export const registry = {
  Hero,
  CardList,
  CTA,
  TicketList,
};

// Dynamic component lookup
function getComponent(type: string) {
  return registry[type];
}
```

### 2. **Factory Pattern**
```typescript
// Component factory
function createComponent(type: string, props: any) {
  const Component = registry[type];
  return <Component {...props} />;
}
```

### 3. **Strategy Pattern**
```typescript
// Different rendering strategies
type RenderStrategy = 'server' | 'client' | 'static';

function renderWithStrategy(strategy: RenderStrategy, blocks: Block[]) {
  switch (strategy) {
    case 'server':
      return renderBlocks(blocks);
    case 'client':
      return <ClientRenderer blocks={blocks} />;
    case 'static':
      return <StaticRenderer blocks={blocks} />;
  }
}
```

## Design Patterns in Our Codebase

### 1. **Component Registry Pattern**
```typescript
// Centralized component management
type ComponentMap = {
  [K in keyof typeof registry]: ComponentType<BlockProps[K]>;
};

// Benefits:
// - Single source of truth
// - Easy to add/remove components
// - Type-safe component lookup
// - Consistent interface
```

### 2. **Discriminated Union Pattern**
```typescript
// Type-safe block system
type Block = HeroBlock | CardListBlock | CTABlock;

// Benefits:
// - Compile-time type safety
// - Exhaustive pattern matching
// - Clear component contracts
// - Easy to extend
```

### 3. **Render Props Pattern**
```typescript
// Flexible rendering
function RenderBlocks({ blocks, renderer }: { 
  blocks: Block[]; 
  renderer?: (block: Block) => React.ReactNode;
}) {
  return (
    <>
      {blocks.map((block, index) => 
        renderer ? renderer(block) : <DefaultRenderer key={index} block={block} />
      )}
    </>
  );
}
```

### 4. **Higher-Order Component (HOC) Pattern**
```typescript
// Component enhancement
function withErrorBoundary<T extends object>(Component: ComponentType<T>) {
  return function WrappedComponent(props: T) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Usage
const SafeHero = withErrorBoundary(Hero);
```

## Interview Questions & Answers

### Q: "How would you scale this component registry system?"
**A:**
```typescript
// 1. Lazy loading
const LazyHero = lazy(() => import('./components/Hero'));

// 2. Component versioning
type ComponentVersion = {
  [K in keyof typeof registry]: {
    [version: string]: ComponentType<any>;
  };
};

// 3. Plugin system
interface ComponentPlugin {
  name: string;
  components: Record<string, ComponentType<any>>;
  install(registry: ComponentRegistry): void;
}

// 4. Micro-frontend architecture
type MicroFrontendRegistry = {
  [app: string]: ComponentRegistry;
};
```

### Q: "How would you handle component dependencies?"
**A:**
```typescript
// Dependency injection
interface ComponentDependencies {
  api: ApiService;
  theme: ThemeService;
  analytics: AnalyticsService;
}

function createComponentFactory(deps: ComponentDependencies) {
  return function createComponent(type: string, props: any) {
    const Component = registry[type];
    return <Component {...props} {...deps} />;
  };
}

// Usage
const factory = createComponentFactory({
  api: new ApiService(),
  theme: new ThemeService(),
  analytics: new AnalyticsService(),
});
```

### Q: "How would you implement component caching?"
**A:**
```typescript
// Component memoization
const componentCache = new Map<string, React.ReactNode>();

function renderBlocksWithCache(blocks: Block[]) {
  return blocks.map((block, index) => {
    const cacheKey = `${block.type}-${JSON.stringify(block.props)}`;
    
    if (componentCache.has(cacheKey)) {
      return componentCache.get(cacheKey);
    }
    
    const component = renderBlock(block);
    componentCache.set(cacheKey, component);
    return component;
  });
}

// React.memo for component-level caching
const MemoizedHero = React.memo(Hero, (prevProps, nextProps) => {
  return prevProps.title === nextProps.title && 
         prevProps.subtitle === nextProps.subtitle;
});
```

### Q: "How would you handle component testing?"
**A:**
```typescript
// Component testing utilities
function createTestRegistry() {
  return {
    Hero: jest.fn(() => <div>Mock Hero</div>),
    CardList: jest.fn(() => <div>Mock CardList</div>),
    CTA: jest.fn(() => <div>Mock CTA</div>),
  };
}

// Integration testing
function renderWithRegistry(blocks: Block[], registry = createTestRegistry()) {
  return render(
    <ComponentRegistryProvider registry={registry}>
      {renderBlocks(blocks)}
    </ComponentRegistryProvider>
  );
}

// Test component rendering
test('renders components correctly', () => {
  const blocks = [
    { type: 'Hero', props: { title: 'Test' } },
    { type: 'CardList', props: { items: [] } },
  ];
  
  renderWithRegistry(blocks);
  
  expect(screen.getByText('Mock Hero')).toBeInTheDocument();
  expect(screen.getByText('Mock CardList')).toBeInTheDocument();
});
```

## Interactive Component Patterns

### 1. **State Management Pattern**
```typescript
// Interview-ready interactive component with performance optimizations
type SortOption = 'price-asc' | 'price-desc' | 'title-asc';

// Sort comparators map for O(1) dispatch
const sortComparators = {
  'price-asc': (a: Ticket, b: Ticket) => a.price - b.price,
  'price-desc': (a: Ticket, b: Ticket) => b.price - a.price,
  'title-asc': (a: Ticket, b: Ticket) => a.title.localeCompare(b.title),
} as const;

// Currency formatter with proper internationalization
const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<SortOption>('price-asc');

  // Derived state with memoization and performance optimizations
  const filteredAndSortedTickets = useMemo(() => {
    // Compute search term once for performance
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
      <div>
        <label htmlFor="search-tickets">Search tickets</label>
        <input
          id="search-tickets"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tickets..."
        />
      </div>
      <div>
        <label htmlFor="sort-tickets">Sort tickets</label>
        <select
          id="sort-tickets"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Title: A to Z</option>
        </select>
      </div>
      <ul>
        {filteredAndSortedTickets.map(ticket => (
          <li key={ticket.id}>
            <strong>{ticket.title}</strong> — {formatPrice(ticket.price, ticket.currency)}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. **Accessibility Pattern**
```typescript
// Consistent accessibility implementation
type AccessibilityProps = {
  'aria-label': string;
  'aria-describedby'?: string;
  role?: string;
};

const createAccessibleInput = (
  type: string,
  value: string,
  onChange: (value: string) => void,
  label: string
) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    aria-label={label}
    placeholder={label}
  />
);
```

### 3. **Performance Optimization Pattern**
```typescript
// Memoization for expensive operations
const ExpensiveComponent = React.memo(({ data, filter, sort }: Props) => {
  const processedData = useMemo(() => {
    return data
      .filter(item => item.title.includes(filter))
      .sort((a, b) => a[sort] - b[sort]);
  }, [data, filter, sort]);

  return <div>{/* render processed data */}</div>;
});
```

## Advanced Architecture Patterns

### 1. **Event-Driven Architecture**
```typescript
// Component event system
interface ComponentEvent {
  type: string;
  payload: any;
  timestamp: number;
}

class ComponentEventBus {
  private listeners: Map<string, Function[]> = new Map();
  
  on(event: string, listener: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }
  
  emit(event: string, payload: any) {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.forEach(listener => listener(payload));
  }
}

// Usage in components
function Hero({ title, onTitleChange }: HeroProps) {
  const eventBus = useEventBus();
  
  const handleClick = () => {
    eventBus.emit('hero:clicked', { title });
  };
  
  return <h1 onClick={handleClick}>{title}</h1>;
}
```

### 2. **State Management Pattern**
```typescript
// Component state management
interface ComponentState {
  [componentId: string]: {
    props: any;
    state: any;
    lastUpdated: number;
  };
}

class ComponentStateManager {
  private state: ComponentState = {};
  
  updateComponent(id: string, props: any, state: any) {
    this.state[id] = {
      props,
      state,
      lastUpdated: Date.now(),
    };
  }
  
  getComponent(id: string) {
    return this.state[id];
  }
  
  subscribe(id: string, callback: Function) {
    // Implementation for state subscriptions
  }
}
```

### 3. **Plugin Architecture**
```typescript
// Plugin system
interface ComponentPlugin {
  name: string;
  version: string;
  components: Record<string, ComponentType<any>>;
  middleware?: (props: any) => any;
  install(registry: ComponentRegistry): void;
}

class PluginManager {
  private plugins: ComponentPlugin[] = [];
  
  install(plugin: ComponentPlugin) {
    this.plugins.push(plugin);
    plugin.install(registry);
  }
  
  getPlugin(name: string) {
    return this.plugins.find(plugin => plugin.name === name);
  }
}
```

## Performance Patterns

### 1. **Virtual Scrolling**
```typescript
// For large component lists
function VirtualizedComponentList({ blocks }: { blocks: Block[] }) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  
  const visibleBlocks = blocks.slice(visibleRange.start, visibleRange.end);
  
  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      {visibleBlocks.map((block, index) => (
        <ComponentRenderer key={index} block={block} />
      ))}
    </div>
  );
}
```

### 2. **Code Splitting**
```typescript
// Dynamic component loading
const componentLoaders = {
  Hero: () => import('./components/Hero'),
  CardList: () => import('./components/CardList'),
  CTA: () => import('./components/CTA'),
};

async function loadComponent(type: string) {
  const loader = componentLoaders[type];
  if (loader) {
    const module = await loader();
    return module.default;
  }
  throw new Error(`Unknown component type: ${type}`);
}
```

## Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Use composition to build complex components
3. **Dependency Injection**: Inject dependencies rather than hardcoding them
4. **Error Boundaries**: Wrap components in error boundaries
5. **Performance Monitoring**: Monitor component performance and optimize
6. **Testing**: Test components in isolation and integration

## Common Pitfalls

1. **Over-engineering**: Don't create complex patterns for simple problems
2. **Tight Coupling**: Avoid tight coupling between components
3. **Performance**: Don't ignore performance implications of patterns
4. **Testing**: Don't skip testing complex architectural patterns
5. **Documentation**: Document architectural decisions and patterns
