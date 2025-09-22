# Component Registry Showcase

A modern, type-safe component registry system built with Next.js, React, TypeScript, and Builder.io integration. This project demonstrates how to create a scalable component architecture with automated testing, linting, and pre-commit hooks.

## 🚀 Features

- **Type-Safe Component Registry** - Centralized component management with full TypeScript support
- **Builder.io Integration** - Ready for visual page building and content management
- **Modern Development Stack** - Next.js 15, React 19, TypeScript 5.9
- **Automated Quality Gates** - ESLint, Jest testing, and pre-commit hooks
- **Component Showcase** - Live examples of Hero, CardList, CTA, and TicketList components
- **Data Transformation Utilities** - Robust ticket data processing with comprehensive validation
- **Testing Suite** - Comprehensive test coverage with React Testing Library

## 🏗️ Architecture

### Component Registry System
```typescript
// Centralized component registry
export const registry = {
  Hero,
  CardList,
  CTA,
};
```

### Type-Safe Block System
```typescript
type Block = HeroBlock | CardListBlock | CTABlock;
```

### Dynamic Rendering
```typescript
// Render blocks dynamically from data
{renderBlocks(page.blocks)}
```

### Data Transformation Utilities
```typescript
// Transform raw ticket data with validation and normalization
import { transformTickets } from 'src/lib/transformTickets';

const tickets = transformTickets(rawData);
```

## 📦 Components

### Hero Component
- **Purpose**: Page headers with title and subtitle
- **Props**: `title`, `subtitle`
- **Usage**: Perfect for landing pages and section headers

### CardList Component
- **Purpose**: Sortable list of items with pricing
- **Props**: `items[]` with `title`, `price`, `href`
- **Features**: Auto-sorting by price, responsive design

### CTA Component
- **Purpose**: Call-to-action buttons
- **Props**: `label`, `href`, `variant` (primary/secondary)
- **Features**: Accessible, customizable styling

### TicketList Component
- **Purpose**: Interactive ticket listing with search and sorting
- **Props**: `tickets[]` with `id`, `title`, `price`, `currency`
- **Features**: 
  - Real-time search (case-insensitive)
  - Multiple sort options (price ascending/descending, title alphabetical)
  - Accessible form controls with proper ARIA labels
  - Responsive design with clean styling
  - Empty state handling

## 🔧 Data Transformation Utilities

### transformTickets Function
- **Purpose**: Transform and validate raw ticket data
- **Input**: Unknown data (arrays of RawTicket objects)
- **Output**: Normalized Ticket objects
- **Features**: 
  - Type-safe validation and transformation
  - Handles missing/invalid data gracefully
  - Filters out invalid entries
  - Converts price_cents to dollars
  - Normalizes currency codes (USD/EUR/GBP)

### Usage Example
```typescript
import { transformTickets } from 'src/lib/transformTickets';

const rawData = [
  { id: 1, title: 'Concert', price_cents: 1234, currency: 'USD' },
  { id: 2, title: null, price_cents: 2000, currency: 'CAD' }
];

const tickets = transformTickets(rawData);
// Result: [
//   { id: '1', title: 'Concert', price: 12.34, currency: 'USD' },
//   { id: '2', title: 'Untitled', price: 20.00, currency: 'USD' }
// ]
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/DouglasMacKrell/component-registery-test-v1.git
   cd component-registery-test-v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |

## 🧪 Testing

The project includes comprehensive testing with:

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **Jest DOM** - Custom matchers for DOM testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
```
tests/
├── Page.test.tsx              # Main app integration tests
├── smoke.test.tsx             # Basic smoke tests
├── renderBlocks.test.tsx      # Component registry tests
├── transformTickets.test.ts   # Data transformation tests
└── TicketList.test.tsx        # Interactive component tests
```

## 🔧 Code Quality

### Pre-commit Hooks
Automated quality checks run before every commit:

- **ESLint** - Code linting with auto-fix
- **Jest** - Related test execution
- **TypeScript** - Type checking

### Linting
```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable components
│   │   ├── Hero.tsx
│   │   ├── CardList.tsx
│   │   ├── CTA.tsx
│   │   └── TicketList.tsx
│   ├── lib/                 # Utility functions
│   │   └── transformTickets.ts
│   ├── registry.ts          # Component registry
│   ├── renderBlocks.tsx     # Dynamic rendering
│   ├── types.ts            # TypeScript definitions
│   └── mockPage.ts         # Sample data
├── tests/                   # Test files
├── .husky/                  # Git hooks
├── eslint.config.cjs        # ESLint configuration
├── jest.config.ts          # Jest configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎯 Use Cases

This component registry is perfect for:

- **Content Management Systems** - Dynamic page building
- **Design Systems** - Centralized component library
- **E-commerce** - Product listings and CTAs
- **Marketing Sites** - Hero sections and call-to-actions
- **Documentation Sites** - Component showcases
- **Data Processing Applications** - Robust data transformation and validation
- **Ticket/Event Systems** - Interactive ticket listings with search and sorting
- **E-commerce Platforms** - Product catalogs with filtering and sorting
- **Event Management** - Ticket sales and event listings

## 🔗 Integration

### Builder.io
Ready for Builder.io integration with:
- Component registration
- Type-safe props
- Dynamic rendering

### Next.js
Optimized for Next.js with:
- App Router support
- Server-side rendering
- Static generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Builder.io](https://builder.io/) - Visual page building
- [React Testing Library](https://testing-library.com/) - Testing utilities
- [Husky](https://typicode.github.io/husky/) - Git hooks

---

**Built with ❤️ for modern web development**
