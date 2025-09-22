import { demoPage } from '../src/mockPage';
import { renderBlocks } from '../src/renderBlocks';

export default function Page() {
  return (
    <main>
      {demoPage.pageTitle && <h1>{demoPage.pageTitle}</h1>}
      {renderBlocks(demoPage.blocks)}
    </main>
  );
}
