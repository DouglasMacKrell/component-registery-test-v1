# Next.js Advanced Concepts

## Next.js 15 Key Features

### 1. **App Router (New Default)**
```typescript
// app/page.tsx - New file-based routing
export default function HomePage() {
  return <div>Home Page</div>;
}

// app/about/page.tsx - Nested routes
export default function AboutPage() {
  return <div>About Page</div>;
}
```

### 2. **Server Components (Default)**
```typescript
// Server Component - runs on server
export default async function ProductPage() {
  const products = await fetchProducts(); // Direct database access
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 3. **Client Components (When Needed)**
```typescript
'use client'; // Directive for client-side features

import { useState } from 'react';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## Our Implementation

### App Router Structure
```
app/
├── page.tsx              # Home page
├── layout.tsx            # Root layout
├── loading.tsx           # Loading UI
├── error.tsx             # Error UI
└── not-found.tsx         # 404 page
```

### Server-Side Rendering
```typescript
// app/page.tsx
import { demoPage } from '../src/mockPage';
import { renderBlocks } from '../src/renderBlocks';

export default function HomePage() {
  return (
    <main>
      {demoPage.pageTitle && <h1>{demoPage.pageTitle}</h1>}
      {renderBlocks(demoPage.blocks)}
    </main>
  );
}
```

## Advanced Patterns

### 1. **Data Fetching Strategies**

#### Static Generation (SSG)
```typescript
// Generate at build time
export async function generateStaticParams() {
  const products = await fetchProducts();
  
  return products.map(product => ({
    slug: product.slug,
  }));
}
```

#### Server-Side Rendering (SSR)
```typescript
// Generate on each request
export async function getServerSideProps() {
  const data = await fetchData();
  
  return {
    props: { data },
  };
}
```

#### Incremental Static Regeneration (ISR)
```typescript
// Revalidate at intervals
export async function getStaticProps() {
  const data = await fetchData();
  
  return {
    props: { data },
    revalidate: 60, // Revalidate every 60 seconds
  };
}
```

### 2. **Middleware**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Authentication, redirects, etc.
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: '/admin/:path*',
};
```

### 3. **API Routes**
```typescript
// app/api/products/route.ts
export async function GET() {
  const products = await fetchProducts();
  return Response.json(products);
}

export async function POST(request) {
  const data = await request.json();
  const product = await createProduct(data);
  return Response.json(product);
}
```

## Interview Questions & Answers

### Q: "What's the difference between Server and Client Components?"
**A:**
- **Server Components**: Run on server, can access databases directly, no JavaScript sent to client
- **Client Components**: Run in browser, can use hooks, event handlers, browser APIs
- **Use Server Components by default**, only use Client Components when you need interactivity

### Q: "How does Next.js handle performance optimization?"
**A:**
- **Automatic Code Splitting**: Each page gets its own bundle
- **Image Optimization**: Built-in `next/image` component
- **Font Optimization**: Automatic font loading optimization
- **Bundle Analysis**: Built-in bundle analyzer
- **Prefetching**: Automatic prefetching of linked pages

### Q: "How would you implement authentication in Next.js?"
**A:**
```typescript
// Using middleware
export function middleware(request) {
  const token = request.cookies.get('auth-token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Using Server Components
export default async function Dashboard() {
  const user = await getUserFromToken();
  
  if (!user) {
    redirect('/login');
  }
  
  return <div>Welcome, {user.name}</div>;
}
```

### Q: "How do you handle SEO in Next.js?"
**A:**
```typescript
// Metadata API
export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.slug);
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}
```

## Performance Optimization

### 1. **Image Optimization**
```typescript
import Image from 'next/image';

// Automatic optimization
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority // For above-the-fold images
/>
```

### 2. **Font Optimization**
```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### 3. **Dynamic Imports**
```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

## Deployment Strategies

### 1. **Vercel (Recommended)**
```bash
# Automatic deployments
npm install -g vercel
vercel --prod
```

### 2. **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 3. **Static Export**
```typescript
// next.config.js
module.exports = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
```

## Best Practices

1. **Use App Router**: It's the future of Next.js
2. **Server Components First**: Only use Client Components when needed
3. **Optimize Images**: Always use `next/image`
4. **Metadata**: Use the Metadata API for SEO
5. **Error Handling**: Implement error boundaries and error pages
6. **Performance**: Monitor Core Web Vitals

## Common Pitfalls

1. **Mixing Server/Client**: Don't import Server Components in Client Components
2. **Bundle Size**: Don't import entire libraries when you only need parts
3. **SEO**: Don't forget metadata and structured data
4. **Performance**: Don't block rendering with heavy operations
5. **Security**: Don't expose sensitive data in Client Components
