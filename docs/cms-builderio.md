# CMS & Builder.io Deep Dive

## What is a CMS?

A **Content Management System (CMS)** is software that allows users to create, manage, and modify digital content without needing technical expertise.

### Traditional CMS vs Headless CMS

| Traditional CMS | Headless CMS |
|----------------|--------------|
| Monolithic (frontend + backend) | API-only |
| Tightly coupled | Loosely coupled |
| Limited flexibility | Framework agnostic |
| WordPress, Drupal | Strapi, Contentful, Builder.io |

## What is Builder.io?

**Builder.io** is a visual, headless CMS that allows non-technical users to build pages and manage content through a drag-and-drop interface.

### Key Features

1. **Visual Page Builder** - Drag-and-drop interface
2. **Component-Based** - Integrates with your existing components
3. **Real-time Preview** - See changes instantly
4. **Multi-channel** - Works with any framework
5. **Developer-Friendly** - Type-safe APIs

## Builder.io Integration

### 1. **Component Registration**
```typescript
// Register components with Builder.io
import { Builder } from '@builder.io/react';

Builder.registerComponent(Hero, {
  name: 'Hero',
  inputs: [
    {
      name: 'title',
      type: 'string',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'string',
    },
  ],
});
```

### 2. **Page Rendering**
```typescript
// Render Builder.io pages
import { BuilderComponent } from '@builder.io/react';

export default function Page() {
  return (
    <BuilderComponent
      model="page"
      content={pageData}
    />
  );
}
```

### 3. **Data Fetching**
```typescript
// Fetch page data
export async function getStaticProps() {
  const page = await builder
    .get('page', {
      url: '/',
    })
    .toPromise();

  return {
    props: {
      page: page || null,
    },
  };
}
```

## Our Implementation Strategy

### Component Registry + Builder.io
```typescript
// Our registry works perfectly with Builder.io
export const registry = {
  Hero,
  CardList,
  CTA,
};

// Builder.io can use our components
Builder.registerComponent(registry.Hero, {
  name: 'Hero',
  inputs: [
    { name: 'title', type: 'string' },
    { name: 'subtitle', type: 'string' },
  ],
});
```

### Dynamic Content
```typescript
// Builder.io provides the data, our registry renders it
const pageData = {
  blocks: [
    { type: 'Hero', props: { title: 'Welcome' } },
    { type: 'CardList', props: { items: products } },
  ],
};

// Our renderBlocks function handles the rendering
return <div>{renderBlocks(pageData.blocks)}</div>;
```

## Interview Questions & Answers

### Q: "How does Builder.io differ from other headless CMSs?"
**A:** 
- **Visual Builder**: Drag-and-drop interface vs code-only
- **Component Integration**: Works with existing React components
- **Real-time Preview**: See changes instantly
- **Developer Experience**: Type-safe APIs and SDKs

### Q: "How would you handle content versioning?"
**A:**
```typescript
// Builder.io supports content versioning
const page = await builder
  .get('page', {
    url: '/',
    version: 'draft', // or 'published'
  })
  .toPromise();
```

### Q: "How do you ensure type safety with CMS content?"
**A:**
```typescript
// Use TypeScript with Builder.io
interface BuilderPage {
  id: string;
  name: string;
  data: {
    blocks: Block[];
  };
}

// Validate at runtime
function validatePageData(data: any): data is BuilderPage {
  return data && Array.isArray(data.blocks);
}
```

### Q: "How would you handle multi-language content?"
**A:**
```typescript
// Builder.io supports localization
const page = await builder
  .get('page', {
    url: '/',
    locale: 'en-US',
  })
  .toPromise();

// Or use our registry with localized data
const localizedBlocks = page.data.blocks.map(block => ({
  ...block,
  props: {
    ...block.props,
    title: getLocalizedText(block.props.title, locale),
  },
}));
```

## Advanced Patterns

### 1. **Content Previews**
```typescript
// Preview mode for content editors
export async function getStaticProps({ preview = false }) {
  const page = await builder
    .get('page', {
      url: '/',
      preview: preview,
    })
    .toPromise();

  return {
    props: { page },
  };
}
```

### 2. **A/B Testing**
```typescript
// Builder.io supports A/B testing
const page = await builder
  .get('page', {
    url: '/',
    test: true, // Enable A/B testing
  })
  .toPromise();
```

### 3. **Content Scheduling**
```typescript
// Schedule content publication
const page = await builder
  .get('page', {
    url: '/',
    includeUnpublished: true,
  })
  .toPromise();
```

## Performance Considerations

### 1. **Caching**
```typescript
// Cache Builder.io content
const page = await builder
  .get('page', {
    url: '/',
    cachebust: false, // Use cached version
  })
  .toPromise();
```

### 2. **Image Optimization**
```typescript
// Builder.io provides optimized images
<BuilderComponent
  model="page"
  content={pageData}
  options={{
    includeRefs: true,
    enrich: true,
  }}
/>
```

### 3. **Bundle Size**
```typescript
// Only load Builder.io components that are used
const usedComponents = page.data.blocks.map(block => block.type);
const componentBundle = usedComponents.map(type => registry[type]);
```

## Best Practices

1. **Component Design**: Make components CMS-friendly with clear prop interfaces
2. **Error Handling**: Provide fallbacks for missing content
3. **Performance**: Use caching and image optimization
4. **Testing**: Test both CMS integration and component rendering
5. **Documentation**: Document component props for content editors

## Common Pitfalls

1. **Over-fetching**: Don't load all content upfront
2. **Type Safety**: Always validate CMS data
3. **Performance**: Don't re-render entire pages on content changes
4. **Security**: Sanitize user-generated content
5. **Fallbacks**: Always provide default content for missing data
