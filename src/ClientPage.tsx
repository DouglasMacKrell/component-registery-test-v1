'use client';
import { renderBlocks } from 'src/renderBlocks';
import type { PageDoc } from 'src/types';

export default function ClientPage({ page }: { page: PageDoc }) {
  return (
    <main>
      {page.pageTitle && <h1>{page.pageTitle}</h1>}
      {renderBlocks(page.blocks)}
    </main>
  );
}
